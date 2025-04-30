import createHttpError from 'http-errors';
import {
  getUserProfile,
  updateUserProfile,
} from '../../services/userProfileService.js';
import {
  handleFileUpload,
  handleMultipleFileUploads,
} from '../../helpers/uploadImageHelper.js';
import { safeParseJSON } from '../../utils/safeParseJSON.js';
import { safeParseDescription } from '../../utils/safeParseDescription.js';

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

//update user profile for logged users
export const updatedUserProfileController = async (req, res) => {
  const { user } = req;

  // -----------------  Код Олександра
  const userProfile = await getUserProfile(user._id);

  if (!userProfile) throw createHttpError(404, 'User profile not found');

  const descriptionObject = safeParseDescription(req.body.description);

  const favoriteArray = req.body.favorite
    ? safeParseJSON(req.body.favorite)
    : userProfile.favorite;
  const clubArray = req.body.club ? req.body.club.split(',') : userProfile.club;
  const coachArray = req.body.coach
    ? req.body.coach.split(',')
    : userProfile.coach;

  const avatarUrl = req.files?.avatar?.[0]
    ? await handleFileUpload(req.files.avatar[0])
    : userProfile.avatar;

  const newPhotoUrls = req.files?.images
    ? await handleMultipleFileUploads(req.files.images)
    : [];
  const updatedPhotoUrls = [...userProfile.images, ...newPhotoUrls];

  const newCertificates = req.files?.certificates
    ? await handleMultipleFileUploads(req.files.certificates)
    : [];
  const updatedCertificates = [...userProfile.certificates, ...newCertificates];
  const updatedData = {
    ...req.body,
    userId: user._id,
    avatar: avatarUrl,
    images: updatedPhotoUrls,
    certificates: updatedCertificates,
    role: user.role,
    description: {
      ...descriptionObject,
      email: user.email,
    },
    club: clubArray,
    coach: coachArray,
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

  // ----------------- Код Оксани
  // try {
  //   const userProfile = await getUserProfile(user._id);
  //   if (!userProfile) {
  //     return res.status(404).json({
  //       status: 404,
  //       message: 'User profile not found',
  //     });
  //   }

  //   // const descriptionObject = req.body.description
  //   //   ? JSON.parse(req.body.description)
  //   //   : {};
  //   const descriptionObject = req.body.description || {};
  //   const clubArray = req.body.club
  //     ? req.body.club.split(',')
  //     : userProfile.club;
  //   const coachArray = req.body.coach
  //     ? req.body.coach.split(',')
  //     : userProfile.coach;

  //   const favoriteArray = req.body.favorite
  //     ? JSON.parse(req.body.favorite)
  //     : userProfile.favorite;

  //   if (descriptionObject instanceof Error) {
  //     return res.status(400).json({
  //       status: 400,
  //       message: 'Invalid JSON format in description',
  //       error: descriptionObject.message,
  //     });
  //   }

  //   const avatarUrl = req.files?.avatar?.[0]
  //     ? await handleFileUpload(req.files.avatar[0])
  //     : userProfile.avatar;

  //   const newPhotoUrls = req.files?.images
  //     ? await handleMultipleFileUploads(req.files.images)
  //     : [];
  //   const updatedPhotoUrls = [...userProfile.images, ...newPhotoUrls];

  //   const newCertificates = req.files?.certificates
  //     ? await handleMultipleFileUploads(req.files.certificates)
  //     : [];
  //   const updatedCertificates = [
  //     ...userProfile.certificates,
  //     ...newCertificates,
  //   ];

  //   const updatedData = {
  //     ...req.body,
  //     userId: user._id,
  //     avatar: avatarUrl,
  //     images: updatedPhotoUrls,
  //     certificates: updatedCertificates,
  //     role: user.role,
  //     description: {
  //       ...descriptionObject,
  //       email: user.email,
  //     },
  //     club: clubArray,
  //     coach: coachArray,
  //     favorite: favoriteArray,
  //   };

  //   const updatedProfile = await updateUserProfile(updatedData, user._id, {
  //     new: true,
  //   });

  //   res.status(200).json({
  //     status: 200,
  //     message: 'User profile updated successfully!',
  //     updatedProfile,
  //   });
  // } catch (error) {
  //   console.error('Error updating profile:', error);
  //   res.status(500).json({
  //     status: 500,
  //     message: 'Error updating user profile',
  //     error: error.message,
  //   });
  // }
};
