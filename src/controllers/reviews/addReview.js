import * as reviewService from '../../services/reviews/reviewService.js';

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
    const userId = req.user.id;
    const { review, overallRating } = await reviewService.addReview(userId, userCommentId, ratings, comment, images);

    res.status(201).json({
        status: 201,
        message: 'Successfully created review!',
        data: review,
        overallRating
    });
};

export const getReviews = async (req, res) => {
    const { clubId, trainerId, sortBy } = req.query;
    const filter = {};
    if (clubId) filter.club = clubId;
    if (trainerId) filter.trainer = trainerId;

    const reviews = await reviewService.getReviews(filter, sortBy);

    res.status(200).json({
        status: 200,
        message: 'Successfully retrieved reviews!',
        data: reviews,
    });
};

export const deleteReview = async (req, res) => {
    await reviewService.deleteReview(req.params.id, req.user.id);

    res.status(200).json({
        status: 200,
        message: 'Review deleted successfully!',
    });
};

export const replyToReview = async (req, res) => {
    const review = await reviewService.replyToReview(req.params.id, req.body.reply);

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
