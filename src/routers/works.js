import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import auth from '../middlewares/auth.js';
import worksAdd from '../controllers/works/addWorks.js';

const router = express.Router();

router.post('/', auth, ctrlWrapper(worksAdd));

export default router;