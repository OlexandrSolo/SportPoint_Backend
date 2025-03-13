import * as reviewService from '../../services/reviews/reviewService.js';
import { ReviewsCollection } from '../../db/models/Review.js';

// export const addReview = async (req, res) => {
//     const { club, trainer, ratings, comment, images } = req.body;
//     const userId = req.user.id;
//     const { review, overallRating } = await reviewService.addReview(userId, club, trainer, ratings, comment, images);

//     res.status(201).json({
//         status: 201,
//         message: 'Successfully created review!',
//         data: review,
//         overallRating
//     });
// };

export const addReview = async (req, res) => {
    const { userCommentId, ratings, comment, images } = req.body;
    const userId = req.user._id;
  
    const { review, overallRating } = await reviewService.addReview(userId, userCommentId, ratings, comment, images);

    res.status(201).json({
        status: 201,
        message: 'Successfully created review!',
        data: review,
        overallRating
    });
};

// export const getReviews = async (req, res) => {
//     const { clubId, trainerId, sortBy } = req.query;
//     const filter = {};
//     if (clubId) filter.club = clubId;
//     if (trainerId) filter.trainer = trainerId;

//     const reviews = await reviewService.getReviews(filter, sortBy);

//     res.status(200).json({
//         status: 200,
//         message: 'Successfully retrieved reviews!',
//         data: reviews,
//     });
// };

// отримання усіх коментарів власника коментару
export const getOwnerReviews = async (req, res) => {
    const { id } = req.params;
    const owner = id;
    const reviews = await ReviewsCollection.find({ owner });

    res.status(200).json({
        status: 200,
        message: 'Successfully retrieved reviews!',
        data: reviews,
        total: reviews.length
    });

}

// отримання усіх коментарів user якого прокоментували
export const getUserReviews = async (req, res) => {
      const { id } = req.params;
      const userCommentId = id;
      const reviews = await ReviewsCollection.find({ userCommentId });

    res.status(200).json({
        status: 200,
        message: 'Successfully retrieved reviews!',
        data: reviews,
        total: reviews.length
    });
}

// редагування коментаря
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;

    await reviewService.updateReviewService(id, _id, req.body);
    res.status(200).json({
        status: 200,
        message: 'Review updated successfully!',
    });
}

// видалення коментаря
export const deleteReview = async (req, res) => {

    await reviewService.deleteReview(req.params.id, req.user._id);

    res.status(200).json({
        status: 200,
        message: 'Review deleted successfully!',
    });
};

// відповідь на коментар
export const replyToReview = async (req, res) => {
    const review = await reviewService.replyToReview(req.params.id, req.body.adminReply, req.user._id);

    res.status(200).json({
        status: 200,
        message: 'Reply added successfully!',
        data: review,
    });
};

export const reportReview = async (req, res) => {
    await reviewService.reportReview(req.params.id, req.user.id, req.body.reason);

    res.status(200).json({
        status: 200,
        message: 'Report submitted successfully!',
    });
};
