import createHttpError from 'http-errors';
import {
  createUserProfile,
  getUserProfile,
} from '../../services/userProfileService.js';
import {
  handleFileUpload,
  handleMultipleFileUploads,
} from '../../helpers/uploadImageHelper.js';
import { ReviewsCollection } from '../../db/models/Review.js';

export const getUserProfileController = async (req, res) => {
  const { _id } = req.user;
  const userProfile = await getUserProfile(_id);
  const userComments = await ReviewsCollection.find({ club: _id });
  const commentsCounts = userComments.length;

  let averageRating = null;

  if (commentsCounts > 0) {
    const totalRating = userComments.reduce(
      (acc, comment) => acc + comment.rating,
      0,
    );
    averageRating = totalRating / commentsCounts;
  } else {
    averageRating = 0;
  }

  if (!userProfile) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found user profile with id ${_id}!`,
    userProfile: {
      ...userProfile,
      userComments: userComments,
      commentsCounts: commentsCounts,
      averageRating: averageRating,
    },
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
