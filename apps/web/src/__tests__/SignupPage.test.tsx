import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = jest.fn();
const mockSignup = jest.fn();
const mockToggle = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
    return ({ children, href, ...rest }: any) => <a href={href} {...rest}>{children}</a>;
});

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        signup: mockSignup,
        user: null,
        token: null,
        loading: false,
        logout: jest.fn(),
        login: jest.fn(),
    }),
}));

jest.mock('@/theme/theme', () => ({
    ColorModeContext: require('react').createContext({ toggleColorMode: mockToggle }),
    createAppTheme: (mode: string) => require('@mui/material/styles').createTheme({ palette: { mode } }),
}));

import SignupPage from '@/app/signup/page';

const theme = createTheme();
const wrap = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SignupPage', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders signup form with Navbar and fields', () => {
        wrap(<SignupPage />);
        expect(screen.getByText('TaskFlow')).toBeTruthy();
        expect(screen.getByRole('heading', { name: /create account/i })).toBeTruthy();
        expect(screen.getByRole('textbox', { name: /full name/i })).toBeTruthy();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy();
    });

    it('renders Create Account submit button', () => {
        wrap(<SignupPage />);
        expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy();
    });

    it('renders link to login page', () => {
        wrap(<SignupPage />);
        expect(screen.getByText('Sign in')).toBeTruthy();
    });

    it('renders theme toggle switch', () => {
        wrap(<SignupPage />);
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeTruthy();
    });

    it('calls signup on form submit', async () => {
        mockSignup.mockResolvedValueOnce(undefined);
        wrap(<SignupPage />);

        fireEvent.change(screen.getByRole('textbox', { name: /full name/i }), {
            target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
            target: { value: 'test@test.com' },
        });

        const passwordInput = document.querySelector('input[type="password"]')!;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        });

        expect(mockSignup).toHaveBeenCalledWith('Test User', 'test@test.com', 'password123');
    });

    it('shows error on signup failure', async () => {
        mockSignup.mockRejectedValueOnce(new Error('Email already registered'));
        wrap(<SignupPage />);

        fireEvent.change(screen.getByRole('textbox', { name: /full name/i }), {
            target: { value: 'Test' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
            target: { value: 'test@test.com' },
        });

        const passwordInput = document.querySelector('input[type="password"]')!;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        });

        await waitFor(() => {
            expect(screen.getByText('Email already registered')).toBeTruthy();
        });
    });
});
