import express from 'express';
import auth from '../middlewares/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as workoutPlanController from '../controllers/workoutPlan/workoutPlans.js';

// import * as workoutPlanSchema from '../validation/workoutPlan/workoutPlaneSchema.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { isValidId } from '../middlewares/isValidId.js'

const workoutPlan = express.Router();

workoutPlan.use(auth);

workoutPlan.get('/', ctrlWrapper(workoutPlanController.getAllWorkoutPlans));

// router.post('/', auth, isValidId, validateBody(workoutPlanSchema.createWorkoutPlan), ctrlWrapper(addWorkoutPlan));
// router.patch('/:id', auth, isValidId, validateBody(workoutPlanSchema.updateWorkoutPlan), ctrlWrapper(updateWorkoutPlan));
workoutPlan.post('/', auth, ctrlWrapper(workoutPlanController.addWorkoutPlan));
workoutPlan.patch('/:id', auth, ctrlWrapper(workoutPlanController.updateWorkoutPlan));

workoutPlan.delete('/:id', auth, ctrlWrapper(workoutPlanController.deleteWorkoutPlan));


export default workoutPlan;