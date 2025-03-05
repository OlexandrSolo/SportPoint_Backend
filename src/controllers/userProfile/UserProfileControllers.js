import createHttpError from 'http-errors';
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  updateUserProfile,
} from '../../services/userProfileService.js';
import {
  handleFileUpload,
  handleMultipleFileUploads,
} from '../../helpers/uploadImageHelper.js';

//get user profile for logged in users
export const getUserProfileController = async (req, res) => {
  const { _id } = req.user;

  const userProfile = await getUserProfile(_id);

  if (!userProfile) {
    throw createHttpError(404, 'Profile not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found user profile with id ${_id}!`,
    userProfile,
  });
};

//create user profile for logged users
export const createUserProfileController = async (req, res) => {
  const { user } = req;

  try {
    const descriptionObject = req.body.description
      ? JSON.parse(req.body.description)
      : {};
    const clubArray = req.body.club ? req.body.club.split(',') : [];
    const couchArray = req.body.couch ? req.body.couch.split(',') : [];

    const favoriteArray = req.body.favorite
      ? JSON.parse(req.body.favorite)
      : [];

    const avatarUrl = req.files?.avatar?.[0]
      ? await handleFileUpload(req.files.avatar[0])
      : null;
    const photoUrls = await handleMultipleFileUploads(req.files?.images || []);
    const certificates = await handleMultipleFileUploads(
      req.files?.certificates || [],
    );

    if (descriptionObject instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid JSON format in description',
        error: descriptionObject.message,
      });
    }

    const profileData = {
      ...req.body,
      userId: user._id,
      avatar: avatarUrl,
      images: photoUrls,
      certificates: certificates,
      role: user.role,
      description: {
        ...descriptionObject,
        email: user.email,
      },
      club: clubArray,
      couch: couchArray,
      favorite: favoriteArray,
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

//update user profile for logged users
export const updatedUserProfileController = async (req, res) => {
  const { user } = req;
  console.log('FILES:', req.files);

  try {
    const userProfile = await getUserProfile(user._id);
    if (!userProfile) {
      return res.status(404).json({
        status: 404,
        message: 'User profile not found',
      });
    }
    console.log('FILES:', req.files);
    console.log('BODY:', req.body);

    const descriptionObject = req.body.description
      ? JSON.parse(req.body.description)
      : {};
    const clubArray = req.body.club
      ? req.body.club.split(',')
      : userProfile.club;
    const couchArray = req.body.couch
      ? req.body.couch.split(',')
      : userProfile.couch;

    const favoriteArray = req.body.favorite
      ? JSON.parse(req.body.favorite)
      : userProfile.favorite;

    if (descriptionObject instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid JSON format in description',
        error: descriptionObject.message,
      });
    }

    const avatarUrl = req.files?.avatar?.[0]
      ? await handleFileUpload(req.files.avatar[0])
      : userProfile.avatar;
    const photoUrls = req.files?.images
      ? await handleMultipleFileUploads(req.files.images)
      : userProfile.images;
    const certificates = req.files?.certificates
      ? await handleMultipleFileUploads(req.files.certificates)
      : userProfile.certificates;

    const updatedData = {
      ...req.body,
      userId: user._id,
      avatar: avatarUrl,
      images: photoUrls,
      certificates: certificates,
      role: user.role,
      description: {
        ...descriptionObject,
        email: user.email,
      },
      club: clubArray,
      couch: couchArray,
      favorite: favoriteArray,
    };

    const updatedProfile = await updateUserProfile(updatedData, user._id, {
      new: true,
    });

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

//delete user profile for logged users
export const delateUserProfileController = async (req, res) => {
  const { _id } = req.user;
  const profile = await deleteUserProfile(_id);

  if (!profile) {
    throw createHttpError(404, 'Profile not found');
  }

  res.status(204).send('Deleted');
};
