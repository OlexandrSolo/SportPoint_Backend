import express from 'express';
import auth from '../middlewares/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addCoachServices,
  deleteCoachServices,
  getAllCoachServicesController,
  updateCoachServices,
} from '../controllers/coachServices/coachServices.js';
import { uploadFields } from '../middlewares/multer.js';

// import * as workoutPlanSchema from '../validation/workoutPlan/workoutPlaneSchema.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { isValidId } from '../middlewares/isValidId.js'

const coachServices = express.Router();

coachServices.use(auth);

coachServices.get('/', ctrlWrapper(getAllCoachServicesController));

// router.post('/', auth, isValidId, validateBody(workoutPlanSchema.createWorkoutPlan), ctrlWrapper(addWorkoutPlan));
// router.patch('/:id', auth, isValidId, validateBody(workoutPlanSchema.updateWorkoutPlan), ctrlWrapper(updateWorkoutPlan));
coachServices.post('/', uploadFields, ctrlWrapper(addCoachServices));
coachServices.patch('/:id', uploadFields, ctrlWrapper(updateCoachServices));

coachServices.delete('/:id', ctrlWrapper(deleteCoachServices));

export default coachServices;
