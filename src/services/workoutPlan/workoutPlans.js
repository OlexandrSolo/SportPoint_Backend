import createHttpError from "http-errors";
import WorkoutPlanCollection from "../../db/models/workoutPlan.js";

export const addWorkoutPlanService = async (userId, plansData) => {
    if (!Array.isArray(plansData)) {
        throw createHttpError(400, "Request body must be an array of workout plans");
    }

    const planArray = plansData.map(plan => ({
        ...plan,
        userId
    }));

    const createWorkoutPlane = await WorkoutPlanCollection.insertMany(planArray);

    return createWorkoutPlane;
};

export const updateWorkoutPlanService = async (id, userId, workoutData) => {
    return await WorkoutPlanCollection.findOneAndUpdate(
        { userId, _id: id },
        { $set: workoutData },
        {
            new: true,
            projection: { createdAt: 0, updatedAt: 0 }
        }
    );
};

export const deleteWorkoutPlanService = async (id, userId) => {
    return await WorkoutPlanCollection.findOneAndDelete(
        { userId, _id: id },
        {
            projection: { createdAt: 0, updatedAt: 0 }
        }
    );
};

export const getAllWorkoutPlans = async (userId) => {
    const totalItems = await WorkoutPlanCollection.find().countDocuments();
    const plans = await WorkoutPlanCollection.find({ userId });

    return { data: plans, totalItems };
};