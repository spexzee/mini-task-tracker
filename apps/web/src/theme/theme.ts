'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { createContext } from 'react';

export const ColorModeContext = createContext({
    toggleColorMode: () => { },
});

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === 'dark'
            ? {
                primary: { main: '#a78bfa', light: '#c4b5fd', dark: '#7c3aed' },
                secondary: { main: '#34d399', light: '#6ee7b7', dark: '#059669' },
                background: {
                    default: '#0f0c29',
                    paper: '#1a1a2e',
                },
                error: { main: '#fb7185' },
                warning: { main: '#fbbf24' },
                success: { main: '#34d399' },
                info: { main: '#38bdf8' },
                text: {
                    primary: '#f1f5f9',
                    secondary: '#a5b4fc',
                },
                divider: 'rgba(167, 139, 250, 0.12)',
            }
            : {
                primary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
                secondary: { main: '#10b981', light: '#34d399', dark: '#047857' },
                background: {
                    default: '#faf5ff',
                    paper: '#ffffff',
                },
                error: { main: '#ef4444' },
                warning: { main: '#f59e0b' },
                success: { main: '#10b981' },
                info: { main: '#0ea5e9' },
                text: {
                    primary: '#1e1b4b',
                    secondary: '#6366f1',
                },
                divider: 'rgba(124, 58, 237, 0.1)',
            }),
    },
    typography: {
        fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 800, letterSpacing: '-0.03em' },
        h5: { fontWeight: 700, letterSpacing: '-0.02em' },
        h6: { fontWeight: 600, letterSpacing: '-0.01em' },
        button: { fontWeight: 600, textTransform: 'none' as const, letterSpacing: '0.02em' },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(167, 139, 250, 0.3)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%)',
                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #7c3aed 100%)',
                        boxShadow: '0 6px 25px rgba(124, 58, 237, 0.55)',
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 24,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined' as const,
                fullWidth: true,
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 56,
                    height: 32,
                    padding: 0,
                },
                switchBase: {
                    padding: 4,
                    '&.Mui-checked': {
                        transform: 'translateX(24px)',
                        '& + .MuiSwitch-track': {
                            opacity: 1,
                            backgroundColor: '#1a1a2e',
                        },
                    },
                },
                thumb: {
                    width: 24,
                    height: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                },
                track: {
                    borderRadius: 16,
                    opacity: 1,
                    backgroundColor: '#e0e7ff',
                },
            },
        },
    },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));
