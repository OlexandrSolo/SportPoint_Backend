import { ReviewsCollection } from '../../db/models/Review.js';
import createHttpError from 'http-errors';

export const addReview = async (req, res) => {
    const { club, trainer, rating, comment, images } = req.body;
    const userId = req.user.id;

    if (!club && !trainer) {
        throw createHttpError(400, 'The review must be linked to a club or trainer');
    }

    const review = await ReviewsCollection.create({
        user: userId,
        club,
        trainer,
        rating,
        comment,
        images,
    });

    if (!review) {
        throw createHttpError(500, 'Server error');
    }

    res.status(201).json({
        status: 201,
        message: 'Successfully created review!',
        data: review,
    });
};

export const getReviews = async (req, res) => {
    const { clubId, trainerId } = req.query;
    const filter = {};

    if (clubId) filter.club = clubId;
    if (trainerId) filter.trainer = trainerId;

    const reviews = await ReviewsCollection.find(filter).populate('user', 'email').exec();

    res.status(200).json({
        status: 200,
        message: 'Successfully retrieved reviews!',
        data: reviews,
    });
};

export const deleteReview = async (req, res) => {
    const review = await ReviewsCollection.findById(req.params.id);

    if (!review) {
        throw createHttpError(404, 'Review not found');
    }

    if (review.user.toString() !== req.user.id) {
        throw createHttpError(403, 'You do not have permission to delete this review');
    }

    await review.deleteOne();

    res.status(200).json({
        status: 200,
        message: 'Review deleted successfully!',
    });
};

export const replyToReview = async (req, res) => {
    const { reply } = req.body;
    const review = await ReviewsCollection.findById(req.params.id);

    if (!review) {
        throw createHttpError(404, 'Review not found');
    }

    review.adminReply = reply;
    await review.save();

    res.status(200).json({
        status: 200,
        message: 'Reply added successfully!',
        data: review,
    });
};

export const reportReview = async (req, res) => {
    const { reason } = req.body;
    const review = await ReviewsCollection.findById(req.params.id);

    if (!review) {
        throw createHttpError(404, 'Review not found');
    }

    review.reports.push({ user: req.user.id, reason });
    await review.save();

    res.status(200).json({
        status: 200,
        message: 'Report submitted successfully!',
    });
};
