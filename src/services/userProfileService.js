import mongoose from 'mongoose';
import { ReviewsCollection } from '../db/models/Review.js';
import { UserProfileModel } from '../db/models/UserProfileModel.js';
import createHttpError from 'http-errors';

//get user profile for logged in user
export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.findOne({ userId: userId }).lean();
  if (!userProfile) {
    throw createHttpError(404, 'Profile not found');
  }

  const { coach: coaches, club: clubs } = userProfile;

  const [coachesList, clubsList] = await Promise.all([
    Promise.all(
      coaches.map(async (coachId) => {
        const coach = await UserProfileModel.findOne({
          userId: coachId,
        }).lean();
        return coach;
      }),
    ),
    Promise.all(
      clubs.map(async (clubId) => {
        const club = await UserProfileModel.findOne({ userId: clubId }).lean();
        return club;
      }),
    ),
  ]);

  let userComments = [];
  if (userProfile.role === 'customer') {
    userComments = await ReviewsCollection.find({ owner: userId });
  } else if (userProfile.role === 'coach') {
    userComments = await ReviewsCollection.find({ userCommentId: userId });
  } else if (userProfile.role === 'adminClub') {
    userComments = await ReviewsCollection.find({ userCommentId: userId });
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

  const newUserProfile = new UserProfileModel({
    ...payload,
    userId: payload.userId,
  });
  await newUserProfile.save();
  return newUserProfile;
};

//update user profile for logged in users
export const updateUserProfile = async (payload, userId, options = {}) => {
  const updatedUserProfile = await UserProfileModel.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    payload,
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
