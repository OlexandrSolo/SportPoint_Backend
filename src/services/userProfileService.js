import mongoose from 'mongoose';
import { ReviewsCollection } from '../db/models/Review.js';
import { UserProfileModel } from '../db/models/UserProfileModel.js';
import createHttpError from 'http-errors';
import WorkoutPlanCollection from '../db/models/workoutPlan.js';

// get user profile for logged in user
export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.findOne({ userId: userId }).lean();
  if (!userProfile) {
    throw createHttpError(404, 'Profile not found');
  }

  const schedule = await WorkoutPlanCollection.find({ userId: userId });

  let userComments = [];
  if (userProfile.role === 'customer') {
    const reviews = await ReviewsCollection.find({ owner: userId });
    const userIds = reviews.map((review) => review.userCommentId);

    const userProfiles = await UserProfileModel.find({
      userId: { $in: userIds },
    });
    const reviewsWithProfiles = reviews.map((review) => {
      const profile = userProfiles.find(
        (userProfile) =>
          userProfile.userId.toString() === review.userCommentId.toString(),
      );
      return {
        ...review.toObject(),
        userProfile: profile || null,
      };
    });

    userComments = reviewsWithProfiles;
  } else if (userProfile.role === 'coach') {
    const reviews = await ReviewsCollection.find({
      userCommentId: userId,
    });

    const userIds = reviews.map((review) => review.owner);

    const userProfiles = await UserProfileModel.find({
      userId: { $in: userIds },
    });

    const reviewsWithProfiles = reviews.map((review) => {
      const profile = userProfiles.find(
        (userProfile) =>
          userProfile.userId.toString() === review.owner.toString(),
      );
      return {
        ...review.toObject(),
        userProfile: profile || null,
      };
    });

    userComments = reviewsWithProfiles;
  } else if (userProfile.role === 'adminClub') {
    const reviews = await ReviewsCollection.find({
      userCommentId: userId,
    });

    const userIds = reviews.map((review) => review.owner);

    const userProfiles = await UserProfileModel.find({
      userId: { $in: userIds },
    });
    const reviewsWithProfiles = reviews.map((review) => {
      const profile = userProfiles.find(
        (userProfile) =>
          userProfile.userId.toString() === review.owner.toString(),
      );
      return {
        ...review.toObject(),
        userProfile: profile || null,
      };
    });

    userComments = reviewsWithProfiles;
  }

  userProfile.description.schedule = [
    ...(userProfile.description.schedule || []),
    ...schedule,
  ];

  return {
    ...userProfile,
    description: {
      ...userProfile.description,
      schedule: userProfile.description.schedule,
    },
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

  const newUserProfile = new UserProfileModel({
    ...payload,
    coach: payload.coach || [],
    club: payload.club || [],
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

  let updatedClub = [];
  if (Array.isArray(payload.club)) {
    const club = payload.club;

    const allStrings = club.every((item) => typeof item === 'string');
    const allObjects = club.every(
      (item) => typeof item === 'object' && item !== null,
    );

    if (allStrings && club.length > 0) {
      const clubString = club.join(',');

      updatedClub = JSON.parse(clubString);
    } else if (allObjects) {
      updatedClub = club.map((item) => ({
        id: item.id || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        address: item.address || '',
        city: item.city || '',
      }));
    } else {
      throw new Error(
        'Invalid club array format — only strings or only objects allowed',
      );
    }
  } else if (typeof payload.club === 'string') {
    try {
      const parsed = JSON.parse(payload.club);

      if (!Array.isArray(parsed)) {
        throw new Error('Parsed club is not an array');
      }

      payload.club = parsed;
    } catch (err) {
      console.error('Помилка при парсингу рядка club:', err.message);
      throw new Error('Invalid format for club');
    }
  } else {
    throw new Error('Invalid format for club — expected array or string');
  }

  let updatedCoach = [];

  if (Array.isArray(payload.coach)) {
    const coach = payload.coach;

    const allStrings = coach.every((item) => typeof item === 'string');
    const allObjects = coach.every(
      (item) => typeof item === 'object' && item !== null,
    );

    if (allStrings && coach.length > 0) {
      const coachString = coach.join(',');

      updatedClub = JSON.parse(coachString);
    } else if (allObjects) {
      updatedCoach = coach.map((item) => ({
        id: item.id || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        address: item.address || '',
        city: item.city || '',
      }));
    } else {
      throw new Error(
        'Invalid club array format — only strings or only objects allowed',
      );
    }
  } else if (typeof payload.coach === 'string') {
    try {
      updatedCoach = JSON.parse(payload.coach);
    } catch (error) {
      console.error(
        'Error parsing coach:',
        error.message,
        'Input:',
        payload.coach,
      );
      throw new Error('Invalid format for coach');
    }
  }

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
