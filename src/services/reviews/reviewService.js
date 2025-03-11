import { ReviewsCollection } from '../../db/models/Review.js';
import createHttpError from 'http-errors';

// Розрахунок середнього рейтинга до відгука
const calculateOverallRatingForReview = (ratings) => {
    const ratingValues = Object.values(ratings);
    return parseFloat((ratingValues.reduce((acc, val) => acc + val, 0) / ratingValues.length).toFixed(2));
};

// Додати відгук
export const addReview = async (userId, club, trainer, ratings, comment, images) => {
    if (!club && !trainer) {
        throw createHttpError(400, 'The review must be linked to a club or trainer');
    }
    
    const review = await ReviewsCollection.create({ user: userId, club, trainer, ratings, comment, images });
    if (!review) throw createHttpError(500, 'Server error');

    return { review, overallRating: calculateOverallRatingForReview(review.ratings) };
};

// Видалити відгук
export const deleteReview = async (reviewId, userId) => {
    const review = await ReviewsCollection.findById(reviewId);
    if (!review) throw createHttpError(404, 'Review not found');
    if (review.user.toString() !== userId) throw createHttpError(403, 'You do not have permission to delete this review');
    
    await review.deleteOne();
};

// Відповідь на відгук
export const replyToReview = async (reviewId, reply) => {
    const review = await ReviewsCollection.findById(reviewId);
    if (!review) throw createHttpError(404, 'Review not found');

    review.adminReply = reply;
    await review.save();
    return review;
};

// Поскаржитись на відгук
export const reportReview = async (reviewId, userId, reason) => {
    const review = await ReviewsCollection.findById(reviewId);
    if (!review) throw createHttpError(404, 'Review not found');

    review.reports.push({ user: userId, reason });
    await review.save();
};

// Фільтр та сортування відгуків
// export const getReviews = async (filter, sortBy) => {
//     let reviews = await ReviewsCollection.find(filter).populate('user', 'email').exec();

//     if (sortBy === 'popularity') {
//         const reviewCounts = await ReviewsCollection.aggregate([
//             { $group: { _id: { club: "$club", trainer: "$trainer" }, count: { $sum: 1 } } },
//             { $sort: { count: -1 } }
//         ]);

//         const sortedIds = reviewCounts.map(item => item._id.club || item._id.trainer);

//         reviews.sort((a, b) => {
//             const aIndex = sortedIds.indexOf(a.club?.toString() || a.trainer?.toString());
//             const bIndex = sortedIds.indexOf(b.club?.toString() || b.trainer?.toString());
//             return aIndex - bIndex;
//         });
//     } else if (sortBy === 'rating') {
//         reviews.sort((a, b) => calculateOverallRatingForReview(b.ratings) - calculateOverallRatingForReview(a.ratings));
//     } else {
//         reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     }

//     return reviews;
// };
