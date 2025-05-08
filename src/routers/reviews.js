import express from 'express';
import {
  addReview,
  getOwnerReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  replyToReview,
  updateReplyToReview,
  deleteReplyToReview,
  reportReview,
} from '../controllers/reviews/addReview.js';

import auth from '../middlewares/auth.js';


import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { reviewSchema } from '../validation/reviews/reviewsValidation.js';
import reviewsSchema from '../validation/reviews/reviewsValidation.js';
import replySchema from '../validation/reviews/replyValidation.js';
import reportsSchema from '../validation/reviews/reportsValidation.js';


const router = express.Router();

router.get('/owner/:id', ctrlWrapper(getOwnerReviews));
router.get('/user/:id', ctrlWrapper(getUserReviews));
router.post('/', auth, reviewsSchema, ctrlWrapper(addReview)); 
router.patch('/:id', auth, reviewsSchema, ctrlWrapper(updateReview));
router.delete('/:id', auth, ctrlWrapper(deleteReview));
router.patch('/:id/reply', auth, replySchema, ctrlWrapper(replyToReview));
router.patch('/:id/reply/update', auth, replySchema, ctrlWrapper(updateReplyToReview));
router.delete('/:id/reply/delete', auth, ctrlWrapper(deleteReplyToReview));
router.post('/:id/report', auth, reportsSchema, ctrlWrapper(reportReview));

export default router;
