import express from 'express';
import { 
    addReview, 
    getReviews, 
    deleteReview, 
    replyToReview, 
    reportReview 
} from '../controllers/reviews/addReview.js';
import auth from '../middlewares/auth.js';


const router = express.Router();

router.post('/', auth, addReview);
router.get('/', getReviews);
router.delete('/:id', auth, deleteReview);
router.patch('/:id/reply', auth, replyToReview);
router.post('/:id/report', auth, reportReview);

export default router;