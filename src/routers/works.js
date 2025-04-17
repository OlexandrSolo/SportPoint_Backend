import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import auth from '../middlewares/auth.js';
import updateWorkSchema from '../validation/work/updateWork.js';
import addWorkSchema from '../validation/work/addWorks.js';

import worksGetAll from '../controllers/works/getAllWorks.js';
import worksAdd from '../controllers/works/addWorks.js';
import worksUpdate from '../controllers/works/updateWork.js';
import worksDelete from '../controllers/works/deleteWork.js';



const router = express.Router();

router.get('/', auth, ctrlWrapper(worksGetAll));
router.post('/', auth, addWorkSchema, ctrlWrapper(worksAdd));
router.patch('/:id', updateWorkSchema, auth, ctrlWrapper(worksUpdate));
router.delete('/:id', auth, ctrlWrapper(worksDelete));


export default router;