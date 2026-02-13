import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/queries/useApi', () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

import useApi from '@/queries/useApi';
import {
    useTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} from '@/queries/useTaskQueries';

const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useTaskQueries', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useTasksQuery', () => {
        it('fetches tasks', async () => {
            const tasks = [{ _id: '1', title: 'Task 1', status: 'pending', owner: 'u1', createdAt: '2026-01-01T00:00:00Z' }];
            mockUseApi.mockResolvedValueOnce(tasks);

            const { result } = renderHook(() => useTasksQuery(), { wrapper: createWrapper() });

            await waitFor(() => expect(result.current.data).toEqual(tasks));
            expect(mockUseApi).toHaveBeenCalledWith('GET', '/api/tasks');
        });
    });

    describe('useCreateTaskMutation', () => {
        it('calls POST to create task', async () => {
            const newTask = { _id: '2', title: 'New', status: 'pending', owner: 'u1', createdAt: '2026-01-01T00:00:00Z' };
            mockUseApi.mockResolvedValueOnce(newTask);

            const { result } = renderHook(() => useCreateTaskMutation(), { wrapper: createWrapper() });

            result.current.mutate({ title: 'New' });

            await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true));
            expect(mockUseApi).toHaveBeenCalledWith('POST', '/api/tasks', { title: 'New' });
        });
    });

    describe('useUpdateTaskMutation', () => {
        it('calls PUT to update task', async () => {
            const updated = { _id: '1', title: 'Updated', status: 'completed', owner: 'u1', createdAt: '2026-01-01T00:00:00Z' };
            mockUseApi.mockResolvedValueOnce(updated);

            const { result } = renderHook(() => useUpdateTaskMutation(), { wrapper: createWrapper() });

            result.current.mutate({ id: '1', status: 'completed' });

            await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true));
            expect(mockUseApi).toHaveBeenCalledWith('PUT', '/api/tasks/1', { status: 'completed' });
        });
    });

    describe('useDeleteTaskMutation', () => {
        it('calls DELETE to remove task', async () => {
            mockUseApi.mockResolvedValueOnce({ message: 'Deleted' });

            const { result } = renderHook(() => useDeleteTaskMutation(), { wrapper: createWrapper() });

            result.current.mutate('1');

            await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true));
            expect(mockUseApi).toHaveBeenCalledWith('DELETE', '/api/tasks/1');
        });
    });
});
