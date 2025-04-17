import mongoose, { Types } from 'mongoose';

const { Schema, model } = mongoose;

const dateSchema = Schema({
    day: {
        type: String,
        required: [true, 'day is required'],
    },
    date: {
        type: String,
        required: [true, 'date is required'],
    },
    hourStart: {
        type: String,
        required: [true, 'hour start is required'],
    },
    hourEnd: {
        type: String,
        required: [true, 'hour end is required'],
    }
});

const clubSchema = Schema({
    id: {
        type: String,
        required: [true, 'id is required'],
    },
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    city: {
        type: String,
        required: [true, 'city is required'],
    },
    address: {
        type: String,
        required: [true, 'address is required'],
    },
    avatar: { type: String },
});

const workSchema = Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    date: dateSchema,
    club: clubSchema,
    gym: {
        type: String,
        required: [true, 'gym is required'],
    }
}, { timestamps: true, timestamps: true,
  versionKey: false });

const Works = model('works', workSchema);

export default Works;