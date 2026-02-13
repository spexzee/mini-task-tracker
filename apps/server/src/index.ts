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

// Connection middleware to ensure DB is connected before handling requests
const ensureConnections = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        await connectDB();
        await connectRedis();
        next();
    } catch (error) {
        console.error('Connection middleware error:', error);
        res.status(500).json({ message: 'Database connection error' });
    }
};

if (config.nodeEnv !== 'test') {
    app.use(ensureConnections);
}

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
        dbState: ['disconnected', 'connected', 'connecting', 'disconnecting'][require('mongoose').connection.readyState]
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Todo server running fine!')
})

const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();
        app.listen(config.port, () => {
            console.log(`🚀 Server running on http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

// Start server if run directly
if (require.main === module) {
    startServer();
}

export default app;
