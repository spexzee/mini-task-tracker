import { createClient, RedisClientType } from 'redis';
import config from './index';

let redisClient: RedisClientType;

const connectRedis = async (): Promise<RedisClientType | null> => {
    if (!config.redisUrl || config.redisUrl === 'redis://localhost:6379') {
        if (config.nodeEnv === 'production') {
            console.warn('Redis URL not provided or using default in production. Skipping Redis connection.');
            return null;
        }
    }

    if (redisClient && redisClient.isOpen) {
        console.log('Redis already connected');
        return redisClient;
    }

    try {
        redisClient = createClient({ url: config.redisUrl });

        redisClient.on('error', (err) => console.error('Redis error:', err));
        redisClient.on('connect', () => console.log('Redis connected'));

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error('Redis connection failed:', error);
        return null; // Return null instead of crashing if Redis is not strictly required
    }
};

export const getRedisClient = (): RedisClientType => redisClient;

export default connectRedis;
