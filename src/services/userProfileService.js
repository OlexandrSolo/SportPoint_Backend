import mongoose from 'mongoose';
import { ReviewsCollection } from '../db/models/Review.js';
import { UserProfileModel } from '../db/models/UserProfileModel.js';
import createHttpError from 'http-errors';

const parseIdArray = (arr) => {
  if (!Array.isArray(arr)) return [];

  return arr.flatMap((item) => {
    try {
      // Check if the item is a valid JSON string
      if (typeof item === 'string' && item.trim().startsWith('{')) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) return parsed;
      }
      return [item];
    } catch (e) {
      console.error('Error parsing JSON:', e.message, 'Input:', item);
      return [item];
    }
  });
};

const normalizeIds = (arr) => {
  if (!Array.isArray(arr)) return [];

  const flat = arr.flatMap((item) => {
    try {
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return item;
    }
  });

  const unique = [...new Set(flat.map(String))];
  return unique.filter((id) => mongoose.Types.ObjectId.isValid(id));
};

// get user profile for logged in user
export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.findOne({ userId: userId }).lean();
  if (!userProfile) {
    throw createHttpError(404, 'Profile not found');
  }

  const { coach, club } = userProfile;

  const fixedCoach = parseIdArray(coach);
  const fixedClub = parseIdArray(club);

  const [coachesList, clubsList] = await Promise.all([
    fixedCoach
      ? Promise.all(
          fixedCoach
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map(async (coachId) => {
              return await UserProfileModel.findOne({ user: coachId }).lean();
            }),
        )
      : [],
    fixedClub
      ? Promise.all(
          fixedClub
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map(async (clubId) => {
              return await UserProfileModel.findOne({ userId: clubId }).lean();
            }),
        )
      : [],
  ]);

  let userComments = [];
  if (userProfile.role === 'customer') {
    userComments = await ReviewsCollection.find({ owner: userId });
  } else if (userProfile.role === 'coach') {
    userComments = await ReviewsCollection.find({
      userCommentId: userId,
      owner: userId,
    });
  } else if (userProfile.role === 'adminClub') {
    userComments = await ReviewsCollection.find({
      userCommentId: userId,
      owner: userId,
    });
  }

  return {
    ...userProfile,
    coaches_list: coachesList,
    work_list: clubsList,
    user_comments: userComments,
  };
};

//create user profile for logged in users
export const createUserProfile = async (payload) => {
  const existingProfile = await UserProfileModel.findOne({
    userId: payload.userId,
  });
  if (existingProfile) {
    throw new Error('User profile already exists');
  }

  const normalizedCoach = normalizeIds(payload.coach);
  const normalizedClub = normalizeIds(payload.club);

  const newUserProfile = new UserProfileModel({
    ...payload,
    coach: normalizedCoach,
    club: normalizedClub,
    userId: payload.userId,
  });

  await newUserProfile.save();
  return newUserProfile;
};

//update user profile for logged in users
export const updateUserProfile = async (payload, userId, options = {}) => {
  const existingProfile = await UserProfileModel.findOne({ userId: userId });
  if (!existingProfile) {
    throw new Error('User profile not found');
  }

  const normalizedCoach = normalizeIds(payload.coach || []);
  const normalizedClub = normalizeIds(payload.club || []);

  const updatedCoach = [
    ...new Set([...(existingProfile.coach || []), ...normalizedCoach]),
  ];
  const updatedClub = [
    ...new Set([...(existingProfile.club || []), ...normalizedClub]),
  ];

  console.log(
    'Payload sport before processing:',
    payload.description.social_links,
  );

  let sportArray = [];
  if (Array.isArray(payload.sport)) {
    sportArray = payload.sport;
  } else if (typeof payload.sport === 'string') {
    try {
      sportArray = JSON.parse(payload.sport);
      if (!Array.isArray(sportArray)) {
        throw new Error('Parsed sport is not an array');
      }
    } catch (error) {
      console.error('Error parsing sport:', error.message);
      sportArray = [];
    }
  }

  const updatedSport = [
    ...new Set([
      ...(existingProfile.sport || []),
      ...sportArray.flatMap((item) => {
        try {
          if (typeof item === 'string' && item.startsWith('[')) {
            const parsed = JSON.parse(item);
            return Array.isArray(parsed) ? parsed : [parsed];
          }
          return [item];
        } catch (error) {
          console.error('Error parsing sport item:', error.message, item);
          return [item];
        }
      }),
    ]),
  ];

  const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    {
      ...payload,
      coach: updatedCoach,
      club: updatedClub,
      sport: updatedSport,
    },
    {
      new: true,
      ...options,
    },
  );

  if (!updatedUserProfile) {
    throw new Error('User profile not found');
  }

  return {
    profile: updatedUserProfile,
    isNew: Boolean(updatedUserProfile?.lastErrorObject?.upserted),
  };
};

//delete user profile for logged in users
export const deleteUserProfile = async (userId) => {
  const profile = await UserProfileModel.findOneAndDelete({ userId: userId });
  return profile;
};
