import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const searchByName = async (name) => {
  const regex = new RegExp(name.trim(), 'i');

  const users = await UserProfileModel.find({
    firstLastName: { $regex: regex },
  });

  return users;
};
