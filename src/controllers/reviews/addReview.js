import { ReviewsCollection } from '../../db/models/Review.js';

export const addReview = async (req, res) => {
    try {
        const { club, trainer, rating, comment, images } = req.body;
        const userId = req.user.id;

        if (!club && !trainer) {
            return res.status(400).json({ message: 'The review must be linked to a club or trainer' });
        }

        const review = await ReviewsCollection.create({
            user: userId,
            club,
            trainer,
            rating,
            comment,
            images,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { clubId, trainerId } = req.query;
        const filter = {};

        if (clubId) filter.club = clubId;
        if (trainerId) filter.trainer = trainerId;

        const reviews = await ReviewsCollection.find(filter).populate('user', 'email').exec();

        res.status(200).json(reviews);
    } catch (error) {
        
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await ReviewsCollection.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this review' });
        }

        await review.deleteOne();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const replyToReview = async (req, res) => {
    try {
        const { reply } = req.body;
        const review = await ReviewsCollection.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.adminReply = reply;
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const reportReview = async (req, res) => {
    try {
        const { reason } = req.body;
        const review = await ReviewsCollection.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.reports.push({ user: req.user.id, reason });
        await review.save();

        res.status(200).json({ message: 'Report submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
