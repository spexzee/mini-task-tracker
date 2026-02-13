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
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: TASKS_KEY });
            const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

            queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) => [
                {
                    _id: `temp-${Date.now()}`,
                    title: newTask.title,
                    description: newTask.description,
                    status: newTask.status || 'pending',
                    dueDate: newTask.dueDate,
                    owner: '',
                    createdAt: new Date().toISOString(),
                },
                ...old,
            ]);

            return { previous };
        },
        onError: (_err, _newTask, context) => {
            if (context?.previous) {
                queryClient.setQueryData(TASKS_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
};

export const useUpdateTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: UpdateTaskData) =>
            useApi<Task>('PUT', `/api/tasks/${id}`, data),
        onMutate: async (updatedTask) => {
            await queryClient.cancelQueries({ queryKey: TASKS_KEY });
            const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

            queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) =>
                old.map((task) =>
                    task._id === updatedTask.id
                        ? { ...task, ...updatedTask, _id: task._id }
                        : task,
                ),
            );

            return { previous };
        },
        onError: (_err, _updatedTask, context) => {
            if (context?.previous) {
                queryClient.setQueryData(TASKS_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
};

export const useDeleteTaskMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            useApi<{ message: string }>('DELETE', `/api/tasks/${id}`),
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: TASKS_KEY });
            const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

            queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) =>
                old.filter((task) => task._id !== deletedId),
            );

            return { previous };
        },
        onError: (_err, _deletedId, context) => {
            if (context?.previous) {
                queryClient.setQueryData(TASKS_KEY, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
        },
    });
};

export type { Task, CreateTaskData, UpdateTaskData };
