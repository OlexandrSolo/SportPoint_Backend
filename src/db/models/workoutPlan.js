import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dateSchema = Schema({
  startTime: {
    type: Date,
    require: [true, 'Must provide start date and time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Must provide end date and time'],
  },
});

const SelectionSchema = Schema({
  selectedType: {
    type: String,
    required: [true, 'Name is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  avatar: { type: String },
});

const WorkoutPlanSchema = Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    date: dateSchema,
    selection: SelectionSchema,
    selectedGym: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const WorkoutPlanCollection = model('workoutPlan', WorkoutPlanSchema);

export default WorkoutPlanCollection;
