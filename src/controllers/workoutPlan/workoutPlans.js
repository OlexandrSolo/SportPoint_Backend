import createHttpError from 'http-errors';
import { ErrorsApp } from '../../constants/errors.js';
import * as workoutPlanServices from '../../services/workoutPlan/workoutPlans.js';

export const addWorkoutPlan = async (req, res) => {
    const user = req.user;
    const body = req.body;

    if (user.role !== 'coach') {
        return res.status(403).json({ message: ErrorsApp.FORBIDDEN });
    }

    const data = await workoutPlanServices.addWorkoutPlanService(user._id, body);

    res.status(201).json({
        status: 201,
        message: 'Successfully added!',
        data
    });
};

export const updateWorkoutPlan = async (req, res) => {
    const { user, params: { id }, body } = req;

    if (user.role !== 'coach') {
        return res.status(403).json({ message: ErrorsApp.FORBIDDEN });
    }
    const updatedWorkout = await workoutPlanServices.updateWorkoutPlanService(id, user._id, body);

    if (!updatedWorkout) {
        throw createHttpError(404, "Workout plan not found or you don't have access");
    }

    res.status(200).json({
        status: 200,
        message: 'Workout plane updated successfully!',
        data: updatedWorkout,
    });
};

export const deleteWorkoutPlan = async (req, res) => {
    const { user, params: { id } } = req;

    if (user.role !== 'coach') {
        throw createHttpError(403, ErrorsApp.FORBIDDEN);
    }

    const deletedWorkoutPlane = await workoutPlanServices.deleteWorkoutPlanService(id, user._id);

    if (!deletedWorkoutPlane) {
        throw createHttpError(404, "Workout plane not found");
    }

    res.status(200).json({
        status: 200,
        message: 'Workout plan deleted successfully!',
        data: deletedWorkoutPlane
    });
};

export const getAllWorkoutPlans = async (req, res) => {
    const user = req.user;

    if (user.role !== 'coach') {
        return res.status(403).json({ message: ErrorsApp.FORBIDDEN });
    };

    const allPlans = await workoutPlanServices.getAllWorkoutPlans(user._id);

    res.json({
        status: 200,
        message: "Successfully find workout plans",
        data: allPlans,
    });
};