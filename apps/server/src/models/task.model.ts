import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    dueDate?: Date;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description must be at most 500 characters'],
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    dueDate: {
        type: Date,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner is required'],
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

taskSchema.index({ owner: 1, status: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
