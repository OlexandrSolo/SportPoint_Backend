import createHttpError from 'http-errors';
import {
  createUserProfile,
  getUserProfile,
} from '../services/userProfileService.js';
import {
  handleFileUpload,
  handleMultipleFileUploads,
} from '../helpers/uploadImageHelper.js';

export const getUserProfileController = async (req, res) => {
  const { userId } = req.params;
  const userProfile = await getUserProfile(userId);
  console.log('UserId', userId);
  if (!userProfile) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found user profile with id ${userId}!`,
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
  console.log('Received files:', req.files);

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
      userId: req.user._id,
      avatar: avatarUrl,
      images: photoUrls,
      description,
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
