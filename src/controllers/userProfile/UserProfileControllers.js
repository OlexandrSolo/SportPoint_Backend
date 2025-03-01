import createHttpError from 'http-errors';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from '../../services/userProfileService.js';
import {
  handleFileUpload,
  handleMultipleFileUploads,
} from '../../helpers/uploadImageHelper.js';

export const getUserProfileController = async (req, res) => {
  const { _id } = req.user;

  const userProfile = await getUserProfile(_id);

  if (!userProfile) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found user profile with id ${_id}!`,
    userProfile,
  });
};

const parseDescription = (description) => {
  if (!description) return null;
  try {
    return JSON.parse(description);
  } catch (error) {
    return error;
  }
};

export const createUserProfileController = async (req, res) => {
  const { user } = req;

  try {
    const avatarUrl = await handleFileUpload(req.files?.avatar?.[0]);
    const photoUrls = await handleMultipleFileUploads(req.files?.images || []);
    const description = parseDescription(req.body.description);

    if (description instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid JSON format in description',
        error: description.message,
      });
    }

    const profileData = {
      ...req.body,
      userId: user._id,
      avatar: avatarUrl,
      images: photoUrls,
      role: user.role,
      description: {
        ...description,
        email: user.email,
      },
    };

    const userProfile = await createUserProfile(profileData);
    res.status(201).json({
      status: 201,
      message: `Successfully created a profile!`,
      data: userProfile,
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      status: 500,
      message: 'Error creating user profile',
      error: error.message,
    });
  }
};

export const updatedUserProfileController = async (req, res) => {
  const { _id } = req.user;
  const { avatar, images } = req.files;
  const { description } = req.body;

  try {
    const userProfile = await getUserProfile(_id);
    if (!userProfile) {
      return res.status(404).json({
        status: 404,
        message: 'User profile not found',
      });
    }

    const updatedData = {};

    if (avatar) updatedData.avatar = await handleFileUpload(avatar[0]);
    if (images && images.length > 0)
      updatedData.images = await handleMultipleFileUploads(images);

    if (description) {
      const parsedDescription = parseDescription(description);
      if (parsedDescription instanceof Error) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid JSON format in description',
          error: parsedDescription.message,
        });
      }
      updatedData.description = parsedDescription;
    }

    const updatedProfile = await updateUserProfile(
      { ...req.body, ...updatedData },
      _id,
      {
        new: true,
      },
    );

    res.status(200).json({
      status: 200,
      message: 'User profile updated successfully!',
      updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      status: 500,
      message: 'Error updating user profile',
      error: error.message,
    });
  }
};
