jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: null, token: null, loading: false,
        login: jest.fn(), signup: jest.fn(), logout: jest.fn(),
    }),
}));

import { useLoginMutation, useSignupMutation } from '@/queries/useAuthQueries';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/queries/useApi', () => ({
    __esModule: true,
    default: jest.fn(),
}));

import useApi from '@/queries/useApi';
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>;

const createWrapper = () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
};

describe('useAuthQueries', () => {
    beforeEach(() => jest.clearAllMocks());

    it('useLoginMutation calls POST /api/auth/login', async () => {
        const response = { token: 'abc', user: { name: 'User', email: 'u@u.com' } };
        mockUseApi.mockResolvedValueOnce(response);

        const { result } = renderHook(() => useLoginMutation(), { wrapper: createWrapper() });
        result.current.mutate({ email: 'u@u.com', password: 'pass' });

        await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true));
        expect(mockUseApi).toHaveBeenCalledWith('POST', '/api/auth/login', { email: 'u@u.com', password: 'pass' });
    });

    it('useSignupMutation calls POST /api/auth/signup', async () => {
        const response = { token: 'xyz', user: { name: 'New', email: 'n@n.com' } };
        mockUseApi.mockResolvedValueOnce(response);

        const { result } = renderHook(() => useSignupMutation(), { wrapper: createWrapper() });
        result.current.mutate({ name: 'New', email: 'n@n.com', password: 'pass' });

        await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true));
        expect(mockUseApi).toHaveBeenCalledWith('POST', '/api/auth/signup', { name: 'New', email: 'n@n.com', password: 'pass' });
    });
});
