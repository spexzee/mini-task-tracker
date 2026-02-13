import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useApi from './useApi';

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    dueDate?: string;
    owner: string;
    createdAt: string;
}

interface CreateTaskData {
    title: string;
    description?: string;
    status?: 'pending' | 'completed';
    dueDate?: string;
}

interface UpdateTaskData extends Partial<CreateTaskData> {
    id: string;
}

const TASKS_KEY = ['tasks'];

export const useTasksQuery = () =>
    useQuery({
        queryKey: TASKS_KEY,
        queryFn: () => useApi<Task[]>('GET', '/api/tasks'),
    });

export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTaskData) =>
            useApi<Task>('POST', '/api/tasks', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
};

export const useUpdateTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: UpdateTaskData) =>
            useApi<Task>('PUT', `/api/tasks/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
};

export const useDeleteTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            useApi<{ message: string }>('DELETE', `/api/tasks/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
};

export type { Task, CreateTaskData, UpdateTaskData };
