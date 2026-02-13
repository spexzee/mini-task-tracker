import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockToggle = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/theme/theme', () => ({
    ColorModeContext: require('react').createContext({ toggleColorMode: mockToggle }),
    createAppTheme: (mode: string) => require('@mui/material/styles').createTheme({ palette: { mode } }),
}));

import Navbar from '@/components/Navbar';

const theme = createTheme();
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const wrap = (ui: React.ReactElement, t = theme) =>
    render(<ThemeProvider theme={t}>{ui}</ThemeProvider>);

describe('Navbar', () => {
    beforeEach(() => jest.clearAllMocks());

    it('renders TaskFlow logo text', () => {
        wrap(<Navbar />);
        expect(screen.getByText('TaskFlow')).toBeTruthy();
    });

    it('renders theme toggle switch', () => {
        wrap(<Navbar />);
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeTruthy();
    });

    it('calls toggleColorMode when switch is toggled', () => {
        wrap(<Navbar />);
        const toggle = screen.getByRole('checkbox', { name: /toggle dark mode/i });
        fireEvent.click(toggle);
        expect(mockToggle).toHaveBeenCalled();
    });

    it('shows user name when showUserControls is true', () => {
        wrap(<Navbar userName="John" onLogout={mockLogout} showUserControls />);
        expect(screen.getByText(/hi, john/i)).toBeTruthy();
    });

    it('does not show user name when showUserControls is false', () => {
        wrap(<Navbar userName="John" />);
        expect(screen.queryByText(/hi, john/i)).toBeNull();
    });

    it('renders logout button when showUserControls is true', () => {
        wrap(<Navbar userName="John" onLogout={mockLogout} showUserControls />);
        expect(screen.getByLabelText('Logout')).toBeTruthy();
    });

    it('calls onLogout when logout button is clicked', () => {
        wrap(<Navbar userName="John" onLogout={mockLogout} showUserControls />);
        fireEvent.click(screen.getByLabelText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('does not render logout button when showUserControls is false', () => {
        wrap(<Navbar />);
        expect(screen.queryByLabelText('Logout')).toBeNull();
    });

    it('renders sun and moon icons', () => {
        wrap(<Navbar />);
        expect(screen.getByTestId('LightModeIcon')).toBeTruthy();
        expect(screen.getByTestId('DarkModeIcon')).toBeTruthy();
    });

    it('renders with dark theme', () => {
        wrap(<Navbar />, darkTheme);
        const toggle = screen.getByRole('checkbox', { name: /toggle dark mode/i });
        expect(toggle).toBeTruthy();
    });
});
