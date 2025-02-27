import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const getUserProfile = async (userId) => {
  const userProfile = await UserProfileModel.find({ userId: userId });
  return userProfile;
};

export const createUserProfile = async (payload) => {
  const newUserProfile = new UserProfileModel({
    ...payload,
    userId: payload.userId,
  });
  await newUserProfile.save();
  return newUserProfile;
};
