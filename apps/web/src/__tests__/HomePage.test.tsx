import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

let mockToken: string | null = null;
let mockLoading = false;

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        token: mockToken,
        loading: mockLoading,
        user: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
    }),
}));

import HomePage from '@/app/page';

const theme = createTheme();

describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockToken = null;
        mockLoading = false;
    });

    it('redirects to /login when no token', () => {
        render(<ThemeProvider theme={theme}><HomePage /></ThemeProvider>);
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('redirects to /dashboard when token exists', () => {
        mockToken = 'some-token';
        render(<ThemeProvider theme={theme}><HomePage /></ThemeProvider>);
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('does not redirect while loading', () => {
        mockLoading = true;
        render(<ThemeProvider theme={theme}><HomePage /></ThemeProvider>);
        expect(mockPush).not.toHaveBeenCalled();
    });

    it('renders null', () => {
        const { container } = render(<ThemeProvider theme={theme}><HomePage /></ThemeProvider>);
        expect(container.innerHTML).toBe('');
    });
});
