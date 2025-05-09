import createHttpError from 'http-errors';
import { ErrorsApp } from '../../constants/errors.js';
import {
  addCoachServicesService,
  deleteCoachServicesService,
  getAllCoachServices,
  updateCoachServicesService,
} from '../../services/coachServices/coachServices.js';
import { handleFileUpload } from '../../helpers/uploadImageHelper.js';

export const addCoachServices = async (req, res) => {
  const user = req.user;
  const body = req.body;

  if (user.role !== 'coach') {
    return res.status(403).json({ message: ErrorsApp.FORBIDDEN });
  }

  const newPhotoUrls =
    req.file?.image ?? (await handleFileUpload(req.files.image[0]));

  const data = await addCoachServicesService(user._id, body, newPhotoUrls);

  res.status(201).json({
    status: 201,
    message: 'Successfully added!',
    data,
  });
};

export const updateCoachServices = async (req, res) => {
  const {
    user,
    params: { id },
    body,
  } = req;

  if (user.role !== 'coach') {
    return res.status(403).json({ message: ErrorsApp.FORBIDDEN });
  }

  const newPhotoUrls =
    req.file?.image ?? (await handleFileUpload(req.files.image[0]));

  const updatedBody = {
    ...body,
    image: newPhotoUrls,
  };

  const updatedWorkout = await updateCoachServicesService(
    id,
    user._id,
    updatedBody,
  );

  if (!updatedWorkout) {
    throw createHttpError(
      404,
      "Coach services not found or you don't have access",
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Coach services updated successfully!',
    data: updatedWorkout,
  });
};

export const deleteCoachServices = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;

  if (user.role !== 'coach') {
    throw createHttpError(403, ErrorsApp.FORBIDDEN);
  }

  const deletedWorkoutPlane = await deleteCoachServicesService(id, user._id);

  if (!deletedWorkoutPlane) {
    throw createHttpError(404, 'Coach services not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Coach services deleted successfully!',
    data: deletedWorkoutPlane,
  });
};

export const getAllCoachServicesController = async (req, res) => {
  const user = req.user;

  if (user.role !== 'coach') {
    return res.status(403).json({ message: ErrorsApp.FORBIDDEN });
  }

  const allPlans = await getAllCoachServices(user._id);

  res.json({
    status: 200,
    message: 'Successfully find coach services',
    data: allPlans,
  });
};
