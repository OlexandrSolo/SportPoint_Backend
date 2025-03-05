import express from 'express';
import {
  addReview,
  getReviews,
  deleteReview,
  replyToReview,
  reportReview,
} from '../controllers/reviews/addReview.js';

import auth from '../middlewares/auth.js';


import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { reviewSchema } from '../validation/reviews/reviewsValidation.js';


const router = express.Router();

router.post('/', auth, validateBody(reviewSchema), ctrlWrapper(addReview)); 
router.get('/', ctrlWrapper(getReviews));
router.delete('/:id', auth, ctrlWrapper(deleteReview));
router.patch('/:id/reply', auth, ctrlWrapper(replyToReview));
router.post('/:id/report', auth, ctrlWrapper(reportReview));

export default router;
