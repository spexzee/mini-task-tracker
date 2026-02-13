import { Response } from 'express';
import Task from '../models/task.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { getRedisClient } from '../config/redis';

const CACHE_TTL = 60;
const getCacheKey = (userId: string) => `tasks:${userId}`;

const invalidateCache = async (userId: string) => {
    try {
        const redis = getRedisClient();
        if (redis) await redis.del(getCacheKey(userId));
    } catch (err) {
        console.error('Redis invalidation error:', err);
    }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const redis = getRedisClient();

        if (redis) {
            const cached = await redis.get(getCacheKey(req.userId!));
            if (cached) {
                res.json(JSON.parse(cached));
                return;
            }
        }

        const tasks = await Task.find({ owner: req.userId }).sort({ createdAt: -1 });

        if (redis) {
            await redis.setEx(getCacheKey(req.userId!), CACHE_TTL, JSON.stringify(tasks));
        }

        res.json(tasks);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, status, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            owner: req.userId,
        });

        await invalidateCache(req.userId!);
        res.status(201).json(task);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e: any) => e.message);
            res.status(400).json({ message: messages.join(', ') });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: id, owner: req.userId },
            { title, description, status, dueDate },
            { new: true, runValidators: true },
        );

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        await invalidateCache(req.userId!);
        res.json(task);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e: any) => e.message);
            res.status(400).json({ message: messages.join(', ') });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        await invalidateCache(req.userId!);
        res.json({ message: 'Task deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

