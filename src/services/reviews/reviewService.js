import { ReviewsCollection } from '../../db/models/Review.js';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';
import createHttpError from 'http-errors';

// Розрахунок середнього рейтинга до відгука
const calculateOverallRatingForReview = async (userCommentId) => {
    const allRatings = [];
    const allReviews = await ReviewsCollection.find({ userCommentId });

    for (let i = 0; i < allReviews.length; i++) {
        const ratingValues = Object.values(allReviews[i].ratings);
        const rating = parseFloat((ratingValues.reduce((acc, val) => acc + val, 0) / ratingValues.length).toFixed(2));
        allRatings.push(rating);
    }

    const generalRating = parseFloat((allRatings.reduce((acc, val) => acc + val, 0) / allRatings.length).toFixed(2));
    return generalRating;
};

// Додати відгук
// export const addReview = async (userId, club, trainer, ratings, comment, images) => {
//     if (!club && !trainer) {
//         throw createHttpError(400, 'The review must be linked to a club or trainer');
//     }

//     const review = await ReviewsCollection.create({ user: userId, club, trainer, ratings, comment, images });
//     if (!review) throw createHttpError(500, 'Server error');

//     return { review, overallRating: calculateOverallRatingForReview(review.ratings) };
// };

export const addReview = async (userId, userCommentId, ratings, comment, recommend) => {
    
    if (!userCommentId) {
        throw createHttpError(400, 'The review must be linked to a club or trainer');
    }
    // Обчислюємо середнє значення оцінки 
    const ratingValues = Object.values(ratings);
    const average = parseFloat(
        (ratingValues.reduce((acc, val) => acc + val, 0) / ratingValues.length).toFixed(2)
    );

    // Створюємо новий відгук
    const review = await ReviewsCollection.create({ owner: userId, userCommentId, ratings, comment, average, recommend });

    if (!review) throw createHttpError(500, 'Server error');

    const reviews = await ReviewsCollection.find({ userCommentId }).countDocuments();
    const user = await UserProfileModel.findOne({ userId: userCommentId });

    // Розраховуємо загальний середній рейтинг по всім відгукам користувача 

    await UserProfileModel.findByIdAndUpdate(user._id, { $set: { countReview: reviews } }, { new: true });

    const overallRating = await calculateOverallRatingForReview(userCommentId);

    await UserProfileModel.findByIdAndUpdate(user._id, { $set: { rating: overallRating } }, { new: true });

    return { review, overallRating };
};

// Редагувати відгук
export const updateReviewService = async (id, owner, body) => {
    const review = await ReviewsCollection.findById(id);
    review.ratings = body.ratings;
    review.comment = body.comment;
    review.recommend = body.recommend;

    // Обчислюємо average
    const ratingValues = Object.values(body.ratings);
    review.average = parseFloat(
        (ratingValues.reduce((acc, val) => acc + val, 0) / ratingValues.length).toFixed(2)
    );

    await ReviewsCollection.findByIdAndUpdate({ owner, _id: id }, review, { new: true, fields: ['-createdAt', '-updatedAt'] });

    const user = await UserProfileModel.findOne({ userId: review.userCommentId });

    const overallRating = await calculateOverallRatingForReview(review.userCommentId);

    await UserProfileModel.findByIdAndUpdate(user._id, { $set: { rating: overallRating } }, { new: true });
};

// Видалити відгук
export const deleteReview = async (reviewId, userId) => {
    const review = await ReviewsCollection.findById(reviewId);

    if (!review) throw createHttpError(404, 'Review not found');
    if (review.owner.toString() !== userId.toString()) throw createHttpError(403, 'You do not have permission to delete this review');

    await review.deleteOne();

    const reviews = await ReviewsCollection.find({ userCommentId: review.userCommentId }).countDocuments();
    const user = await UserProfileModel.findOne({ userId: review.userCommentId });

    await UserProfileModel.findByIdAndUpdate(user._id, { $set: { countReview: reviews } }, { new: true });

    const overallRating = await calculateOverallRatingForReview(review.userCommentId);

    await UserProfileModel.findByIdAndUpdate(user._id, { $set: { rating: overallRating } }, { new: true });
};

// Відповідь на відгук
export const replyToReview = async (reviewId, reply, userId) => {
    const review = await ReviewsCollection.findById(reviewId);
    if (!review) throw createHttpError(404, 'Review not found');

    if (userId.toString() !== review.userCommentId.toString())
        throw createHttpError(404, 'You are not the user being commented on.');

    review.adminReply = reply;
    await review.save();
    return review;
};

// редагувати відповідь на відгук

export const updateReply = async (id, userId, adminReply) => {
      const review = await ReviewsCollection.findById(id);
    if (!review) throw createHttpError(404, 'Review not found');

    if (userId.toString() !== review.userCommentId.toString())
        throw createHttpError(404, 'You are not the user being commented on.');
   
    const newReply = await ReviewsCollection.findByIdAndUpdate({ _id: id },
        adminReply, { new: true, fields: ['-createdAt', '-updatedAt'] })
    return newReply;
}

// видалити відповідь на відгук
export const deleteReply = async (id, userId) => {
    const review = await ReviewsCollection.findById(id);
    if (!review) throw createHttpError(404, 'Review not found');

    if (userId.toString() !== review.userCommentId.toString())
        throw createHttpError(404, 'You are not the user being commented on.');
      const newReply = await ReviewsCollection.findByIdAndUpdate({ _id: id },
       {adminReply: ''} , { new: true, fields: ['-createdAt', '-updatedAt'] })
    return newReply;
}

// Поскаржитись на відгук
export const reportReview = async (reviewId, userId, reason) => {
    const review = await ReviewsCollection.findById(reviewId);
    if (!review) throw createHttpError(404, 'Review not found');
    if (userId.toString() !== review.userCommentId.toString())
        throw createHttpError(404, 'You are not the user being commented on.');

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
