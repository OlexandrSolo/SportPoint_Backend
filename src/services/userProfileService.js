import mongoose from 'mongoose';
import { ReviewsCollection } from '../db/models/Review.js';
import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.findOne({ userId: userId }).lean();
  const viewingOwnProfile = userId.equals(userProfile.userId);
  console.log('userId', userId);
  console.log('userProfile', userProfile.userId);
  console.log('viewingOwnProfile', viewingOwnProfile);

  let userComments = [];
  if (userProfile.role === 'customer') {
    if (viewingOwnProfile) {
      console.log(1);
      userComments = await ReviewsCollection.find({ user: userId });
    } else {
      console.log(2);

      userComments = await ReviewsCollection.find({ club: userProfile.userId });
    }
  } else if (userProfile.role === 'coach' || userProfile.role === 'adminClub') {
    console.log(3);

    userComments = await ReviewsCollection.find({ user: userId });
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
