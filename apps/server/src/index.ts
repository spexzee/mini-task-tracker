import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import connectDB from './config/db';
import connectRedis from './config/redis';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const startServer = async () => {
    await connectDB();
    await connectRedis();
    app.listen(config.port, () => {
        console.log(`🚀 Server running on http://localhost:${config.port}`);
    });
};

// Only start server if this file is run directly (not imported by tests)
if (require.main === module) {
    startServer();
}

export default app;
