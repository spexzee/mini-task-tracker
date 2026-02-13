import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockToggle = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
    return ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a>;
});

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
        user: null,
        token: null,
        loading: false,
        logout: jest.fn(),
        signup: jest.fn(),
    }),
}));

jest.mock('@/theme/theme', () => ({
    ColorModeContext: require('react').createContext({ toggleColorMode: mockToggle }),
    createAppTheme: (mode: string) => require('@mui/material/styles').createTheme({ palette: { mode } }),
}));

import LoginPage from '@/app/login/page';

const theme = createTheme();
const wrap = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('LoginPage', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders login form with Navbar and fields', () => {
        wrap(<LoginPage />);
        expect(screen.getByText('TaskFlow')).toBeTruthy();
        expect(screen.getByText('Welcome Back')).toBeTruthy();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy();
    });

    it('renders Sign In button', () => {
        wrap(<LoginPage />);
        expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
    });

    it('renders link to signup page', () => {
        wrap(<LoginPage />);
        expect(screen.getByText('Sign up')).toBeTruthy();
    });

    it('renders theme toggle switch', () => {
        wrap(<LoginPage />);
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeTruthy();
    });

    it('calls login on form submit', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        wrap(<LoginPage />);

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

        const passwordInput = document.querySelector('input[type="password"]')!;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        });

        expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
    });

    it('shows error on login failure', async () => {
        mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
        wrap(<LoginPage />);

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

        const passwordInput = document.querySelector('input[type="password"]')!;
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        });

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeTruthy();
        });
    });

    it('toggles password visibility', () => {
        wrap(<LoginPage />);

        const passwordInput = document.querySelector('input[type="password"]')!;
        expect(passwordInput).toBeTruthy();

        const visIcon = screen.getByTestId('VisibilityIcon');
        const toggleBtn = visIcon.closest('button')!;
        fireEvent.click(toggleBtn);

        const textInput = document.querySelector('input[type="text"][id]');
        expect(textInput).toBeTruthy();
    });
});
