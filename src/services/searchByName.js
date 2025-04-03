import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const searchByName = async (name) => {
  const regex = new RegExp(name.trim(), 'i');

  const userFirst = await UserProfileModel.find({
    firstName: { $regex: regex },
  });
  const userLast = await UserProfileModel.find({
    lastName: { $regex: regex },
  });
  const users = [...userFirst, ...userLast];
  return users;
};
