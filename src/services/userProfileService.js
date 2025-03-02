import mongoose from 'mongoose';
import { ReviewsCollection } from '../db/models/Review.js';
import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.findOne({ userId: userId }).lean();
  const viewingOwnProfile = userId.equals(userProfile.userId);

  let userComments = [];
  if (userProfile.role === 'customer') {
    if (viewingOwnProfile) {
      console.log(1);
      userComments = await ReviewsCollection.find({ user: userId });
    }
  } else if (userProfile.role === 'coach') {
    console.log(3);
    userComments = await ReviewsCollection.find({ trainer: userId });
  } else if (userProfile.role === 'adminClub') {
    console.log(4);
    userComments = await ReviewsCollection.find({ club: userId });
  }

  const commentsCounts = userComments.length;
  const totalRating = userComments.reduce(
    (acc, comment) => acc + comment.rating,
    0,
  );
  const averageRating = commentsCounts > 0 ? totalRating / commentsCounts : 0;

  return {
    ...userProfile,
    userComments: userComments,
    commentsCounts: commentsCounts,
    averageRating: averageRating,
  };
};

//create user profile for logged users
export const createUserProfile = async (payload) => {
  const existingProfile = await UserProfileModel.findOne({
    userId: payload.userId,
  });
  console.log('existingProfile', existingProfile);
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

//update user profile for logged users
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

//delete user profile for logged users
export const deleteUserProfile = async (userId) => {
  const profile = await UserProfileModel.findOneAndDelete({ userId: userId });
  return profile;
};
