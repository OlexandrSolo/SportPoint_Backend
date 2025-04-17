import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import auth from '../middlewares/auth.js';
import worksAdd from '../controllers/works/addWorks.js';
import worksUpdate from '../controllers/works/updateWork.js';

const router = express.Router();

router.post('/', auth, ctrlWrapper(worksAdd));
router.patch('/:id', auth, ctrlWrapper(worksUpdate));

export default router;