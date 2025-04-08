import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const searchByName = async (name) => {
  const words = name.trim().split(/\s+/);

  const regexConditions = words.map((word) => {
    const regex = new RegExp(word, 'i');
    return {
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    };
  });

  const users = await UserProfileModel.find({
    $and: regexConditions,
  });

  return users;
};
