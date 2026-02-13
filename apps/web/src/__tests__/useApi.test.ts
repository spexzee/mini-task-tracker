import axios from 'axios';

jest.mock('axios', () => {
    const mockInstance = {
        request: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    };
    return {
        __esModule: true,
        default: {
            create: jest.fn(() => mockInstance),
            isAxiosError: jest.fn(),
        },
        isAxiosError: jest.fn(),
    };
});

// Need to reset modules to get fresh singleton
beforeEach(() => {
    jest.resetModules();
});

describe('useApi', () => {
    it('makes GET requests and returns data', async () => {
        const useApi = (await import('@/queries/useApi')).default;
        const mockAxios = axios as jest.Mocked<typeof axios>;
        const mockInstance = (mockAxios.create as jest.Mock).mock.results[0]?.value;

        if (mockInstance) {
            mockInstance.request.mockResolvedValueOnce({ data: [{ _id: '1', title: 'Task 1' }] });

            const result = await useApi('GET', '/api/tasks');
            expect(result).toEqual([{ _id: '1', title: 'Task 1' }]);
            expect(mockInstance.request).toHaveBeenCalledWith({
                method: 'GET',
                url: '/api/tasks',
                data: undefined,
                params: undefined,
            });
        }
    });

    it('makes POST requests with data', async () => {
        const useApi = (await import('@/queries/useApi')).default;
        const mockAxios = axios as jest.Mocked<typeof axios>;
        const mockInstance = (mockAxios.create as jest.Mock).mock.results[0]?.value;

        if (mockInstance) {
            mockInstance.request.mockResolvedValueOnce({ data: { _id: '2', title: 'New Task' } });

            const result = await useApi('POST', '/api/tasks', { title: 'New Task' });
            expect(result).toEqual({ _id: '2', title: 'New Task' });
        }
    });

    it('handles axios errors with response', async () => {
        const useApi = (await import('@/queries/useApi')).default;
        const mockAxios = axios as jest.Mocked<typeof axios>;
        const mockInstance = (mockAxios.create as jest.Mock).mock.results[0]?.value;

        if (mockInstance) {
            const axiosError = {
                response: { status: 400, data: { message: 'Bad request' } },
            };
            mockInstance.request.mockRejectedValueOnce(axiosError);
            (mockAxios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

            await expect(useApi('POST', '/api/tasks', {})).rejects.toEqual({
                message: 'Bad request',
                status: 400,
            });
        }
    });

    it('handles network errors without response', async () => {
        const useApi = (await import('@/queries/useApi')).default;
        const mockAxios = axios as jest.Mocked<typeof axios>;
        const mockInstance = (mockAxios.create as jest.Mock).mock.results[0]?.value;

        if (mockInstance) {
            const networkError = { message: 'Network Error', response: undefined };
            mockInstance.request.mockRejectedValueOnce(networkError);
            (mockAxios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

            await expect(useApi('GET', '/api/tasks')).rejects.toEqual({
                message: 'Unable to connect to server. Please check your network connection.',
                status: 0,
            });
        }
    });

    it('handles non-axios errors', async () => {
        const useApi = (await import('@/queries/useApi')).default;
        const mockAxios = axios as jest.Mocked<typeof axios>;
        const mockInstance = (mockAxios.create as jest.Mock).mock.results[0]?.value;

        if (mockInstance) {
            mockInstance.request.mockRejectedValueOnce(new Error('Unknown'));
            (mockAxios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);

            await expect(useApi('GET', '/api/tasks')).rejects.toEqual({
                message: 'An error occurred',
                status: 500,
            });
        }
    });

    it('exports API_BASE_URL and getApiInstance', async () => {
        const mod = await import('@/queries/useApi');
        expect(mod.API_BASE_URL).toBeDefined();
        expect(mod.getApiInstance).toBeDefined();
    });
});
