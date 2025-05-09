import CoachServicesCollection from '../../db/models/CoachServices.js';

export const addCoachServicesService = async (userId, serviceData, image) => {
  const planArray = { ...serviceData, image, userId };

  const createWorkoutPlane = await CoachServicesCollection.create(planArray);

  return createWorkoutPlane;
};

export const updateCoachServicesService = async (id, userId, serviceData) => {
  return await CoachServicesCollection.findOneAndUpdate(
    { userId, _id: id },
    { $set: serviceData },
    {
      new: true,
      projection: { createdAt: 0, updatedAt: 0 },
    },
  );
};

export const deleteCoachServicesService = async (id, userId) => {
  return await CoachServicesCollection.findOneAndDelete(
    { userId, _id: id },
    {
      projection: { createdAt: 0, updatedAt: 0 },
    },
  );
};

export const getAllCoachServices = async (userId) => {
  const totalItems = await CoachServicesCollection.find().countDocuments();
  const plans = await CoachServicesCollection.find({ userId });

  return { data: plans, totalItems };
};
