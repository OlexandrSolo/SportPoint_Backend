import mongoose from 'mongoose';
import { ReviewsCollection } from '../db/models/Review.js';
import { UserProfileModel } from '../db/models/UserProfileModel.js';
import createHttpError from 'http-errors';

// get user profile for logged in user
export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.findOne({ userId: userId }).lean();
  if (!userProfile) {
    throw createHttpError(404, 'Profile not found');
  }

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

  return {
    ...userProfile,
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
    try {
      const combinedString = payload.club.join(',');
      updatedClub = JSON.parse(combinedString);
    } catch (error) {
      console.error(
        'Error parsing combined club JSON:',
        error.message,
        'Input:',
        payload.club,
      );
      throw new Error('Invalid format for club');
    }
  } else if (typeof payload.club === 'string') {
    try {
      updatedClub = JSON.parse(payload.club);
    } catch (error) {
      console.error(
        'Error parsing club:',
        error.message,
        'Input:',
        payload.club,
      );
      throw new Error('Invalid format for club');
    }
  }

  updatedClub = updatedClub.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return {
        id: item.id || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        address: item.address || '',
        city: item.city || '',
      };
    }
    console.error('Invalid club item:', item);
    throw new Error('Invalid club item format');
  });

  let updatedCoach = [];
  if (Array.isArray(payload.coach)) {
    updatedCoach = payload.coach.flatMap((item) => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch (error) {
          console.error(
            'Error parsing coach item:',
            error.message,
            'Input:',
            item,
          );
          throw new Error('Invalid format for coach item');
        }
      }
      return item;
    });
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

  updatedCoach = updatedCoach.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return {
        id: item.id || '',
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        address: item.address || '',
        city: item.city || '',
      };
    }
    console.error('Invalid coach item:', item);
    throw new Error('Invalid coach item format');
  });

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
