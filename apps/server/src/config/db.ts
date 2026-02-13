import mongoose from 'mongoose';
import config from './index';

const connectDB = async (): Promise<void> => {
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB already connected or connecting...');
        return;
    }
    try {
        await mongoose.connect(config.mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // On Vercel, we might not want to exit the process, but just throw the error
        // for the request handler to catch.
        throw error;
    }
};

export default connectDB;
