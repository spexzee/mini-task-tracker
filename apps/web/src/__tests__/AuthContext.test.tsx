import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockLogin = jest.fn();
const mockSignup = jest.fn();

jest.mock('@/queries/useAuthQueries', () => ({
    useLoginMutation: () => ({ mutateAsync: mockLogin }),
    useSignupMutation: () => ({ mutateAsync: mockSignup }),
}));

import { AuthProvider, useAuth } from '@/context/AuthContext';

const theme = createTheme();
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const TestConsumer = () => {
    const auth = useAuth();
    return (
        <div>
            <span data-testid="loading">{String(auth.loading)}</span>
            <span data-testid="token">{auth.token || 'none'}</span>
            <span data-testid="user">{auth.user?.name || 'none'}</span>
            <button onClick={() => auth.login('test@test.com', 'password')}>Login</button>
            <button onClick={() => auth.signup('Test', 'test@test.com', 'password')}>Signup</button>
            <button onClick={auth.logout}>Logout</button>
        </div>
    );
};

const renderAuth = () =>
    render(
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <TestConsumer />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>,
    );

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('provides initial state with loading=true then false', async () => {
        renderAuth();
        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('token').textContent).toBe('none');
        expect(screen.getByTestId('user').textContent).toBe('none');
    });

    it('loads token and user from localStorage', async () => {
        localStorage.setItem('token', 'stored-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Stored User', email: 'stored@test.com' }));

        renderAuth();
        await waitFor(() => {
            expect(screen.getByTestId('token').textContent).toBe('stored-token');
        });
        expect(screen.getByTestId('user').textContent).toBe('Stored User');
    });

    it('calls login mutation and stores result', async () => {
        mockLogin.mockResolvedValueOnce({
            token: 'new-token',
            user: { name: 'Test User', email: 'test@test.com' },
        });

        renderAuth();
        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Login'));
        });

        expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
        expect(localStorage.getItem('token')).toBe('new-token');
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('calls signup mutation and stores result', async () => {
        mockSignup.mockResolvedValueOnce({
            token: 'signup-token',
            user: { name: 'Test', email: 'test@test.com' },
        });

        renderAuth();
        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Signup'));
        });

        expect(mockSignup).toHaveBeenCalledWith({ name: 'Test', email: 'test@test.com', password: 'password' });
        expect(localStorage.getItem('token')).toBe('signup-token');
    });

    it('clears state and redirects on logout', async () => {
        localStorage.setItem('token', 'old-token');
        localStorage.setItem('user', JSON.stringify({ name: 'User' }));

        renderAuth();
        await waitFor(() => {
            expect(screen.getByTestId('token').textContent).toBe('old-token');
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Logout'));
        });

        expect(screen.getByTestId('token').textContent).toBe('none');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('throws error when useAuth is used outside AuthProvider', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
        expect(() =>
            render(
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <TestConsumer />
                    </ThemeProvider>
                </QueryClientProvider>,
            ),
        ).toThrow('useAuth must be used within AuthProvider');
        consoleError.mockRestore();
    });
});
