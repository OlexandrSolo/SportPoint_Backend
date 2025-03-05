import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { searchByNameController } from '../controllers/search/searchByName.js';

const searchRouter = Router();

searchRouter.get('/by-name', ctrlWrapper(searchByNameController));

export default searchRouter;
