import express from 'express';
import {
    addReview,
    getReviews,
    deleteReview,
    replyToReview,
    reportReview
} from '../controllers/reviews/addReview.js';
import auth from '../middlewares/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js'; 

const router = express.Router();

router.post('/', auth, ctrlWrapper(addReview)); 
router.get('/', ctrlWrapper(getReviews));
router.delete('/:id', auth, ctrlWrapper(deleteReview));
router.patch('/:id/reply', auth, ctrlWrapper(replyToReview));
router.post('/:id/report', auth, ctrlWrapper(reportReview));

export default router;
