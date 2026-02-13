import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// TODO: Mount auth routes
// TODO: Mount task routes

// Start server
const startServer = () => {
    app.listen(config.port, () => {
        console.log(`🚀 Server running on http://localhost:${config.port}`);
        console.log(`📊 Environment: ${config.nodeEnv}`);
    });
};

startServer();

export default app;
