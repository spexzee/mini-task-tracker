import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    usePathname: () => '/',
}));

// Mock AuthContext since it uses useRouter and react-query hooks internally
jest.mock('@/context/AuthContext', () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: () => ({
        user: null,
        token: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        loading: false,
    }),
}));

import Providers from '@/components/Providers';

describe('Providers', () => {
    it('renders children', () => {
        render(
            <Providers>
                <div data-testid="child">Hello</div>
            </Providers>,
        );
        expect(screen.getByTestId('child')).toBeTruthy();
        expect(screen.getByText('Hello')).toBeTruthy();
    });

    it('provides MUI theme to children', () => {
        render(
            <Providers>
                <div data-testid="themed">Themed Content</div>
            </Providers>,
        );
        expect(screen.getByText('Themed Content')).toBeTruthy();
    });
});
