import { createClient, RedisClientType } from 'redis';
import config from './index';

let redisClient: RedisClientType;

const connectRedis = async (): Promise<RedisClientType> => {
    redisClient = createClient({ url: config.redisUrl });

    redisClient.on('error', (err) => console.error('Redis error:', err));
    redisClient.on('connect', () => console.log('Redis connected'));

    await redisClient.connect();
    return redisClient;
};

export const getRedisClient = (): RedisClientType => redisClient;

export default connectRedis;
