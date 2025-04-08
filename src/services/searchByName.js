import { UserProfileModel } from '../db/models/UserProfileModel.js';

export const searchByName = async (name, role) => {
  const words = name.trim().split(/\s+/);

  const regexConditions = words.map((word) => {
    const regex = new RegExp(word, 'i');
    return {
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    };
  });

  const filter = {
    $and: regexConditions,
  };

  if (role && role.length > 0) {
    filter.role = { $in: role };
  }

  const users = await UserProfileModel.find(filter);

  return users;
};
