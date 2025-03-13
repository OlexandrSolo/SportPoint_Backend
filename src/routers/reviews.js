import express from 'express';
import {
  addReview,
 
  updateReview,
  deleteReview,
  replyToReview,
  reportReview,
} from '../controllers/reviews/addReview.js';

import auth from '../middlewares/auth.js';


import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { reviewSchema } from '../validation/reviews/reviewsValidation.js';
import reviewsSchema from '../validation/reviews/reviewsValidation.js';


const router = express.Router();


router.post('/', auth, reviewsSchema, ctrlWrapper(addReview)); 
router.patch('/:id', auth, reviewsSchema, ctrlWrapper(updateReview))
router.delete('/:id', auth, ctrlWrapper(deleteReview));
router.patch('/:id/reply', auth, ctrlWrapper(replyToReview));
router.post('/:id/report', auth, ctrlWrapper(reportReview));

export default router;
