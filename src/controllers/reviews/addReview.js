import { ReviewsCollection } from '../../db/models/Review.js';
import createHttpError from 'http-errors';

// Функція розрахунку середнього рейтингу для одного відгуку
const calculateOverallRatingForReview = (ratings) => {
    const ratingValues = Object.values(ratings);
    const avgRating = ratingValues.reduce((acc, val) => acc + val, 0) / ratingValues.length;
    return parseFloat(avgRating.toFixed(2));
};

// Додавання нового відгуку
export const addReview = async (req, res) => {
    const { club, trainer, ratings, comment, images } = req.body;
    const userId = req.user.id;

    if (!club && !trainer) {
        throw createHttpError(400, 'The review must be linked to a club or trainer');
    }

    const review = await ReviewsCollection.create({
        user: userId,
        club,
        trainer,
        ratings,
        comment,
        images,
    });

    if (!review) {
        throw createHttpError(500, 'Server error');
    }

    // Обчислюємо середній рейтинг для відгуку
    const overallRating = calculateOverallRatingForReview(review.ratings);

    res.status(201).json({
        status: 201,
        message: 'Successfully created review!',
        data: review,
        overallRating, 
    });
};

// Отримання відгуків
export const getReviews = async (req, res) => {
    const { clubId, trainerId, sortBy } = req.query;
    const filter = {};

    if (clubId) filter.club = clubId;
    if (trainerId) filter.trainer = trainerId;

    let reviews = await ReviewsCollection.find(filter)
        .populate('user', 'email')
        .exec();

    if (sortBy === 'popularity') {
        const reviewCounts = await ReviewsCollection.aggregate([
            {
                $group: {
                    _id: { club: "$club", trainer: "$trainer" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const sortedIds = reviewCounts.map(item => item._id.club || item._id.trainer);

        reviews.sort((a, b) => {
            const aIndex = sortedIds.indexOf(a.club?.toString() || a.trainer?.toString());
            const bIndex = sortedIds.indexOf(b.club?.toString() || b.trainer?.toString());
            return aIndex - bIndex;
        });

    } else if (sortBy === 'rating') {
        reviews.sort((a, b) => {
            const avgA = calculateOverallRatingForReview(a.ratings);
            const avgB = calculateOverallRatingForReview(b.ratings);
            return avgB - avgA; // Від вищого рейтингу до нижчого
        });
    } else {
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // За датою
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully retrieved reviews!',
        data: reviews,
    });
};

// Видалення відгуку
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

// Додавання відповіді на відгук
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

// Скарга на відгук
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
