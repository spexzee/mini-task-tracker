'use client';

import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext, createAppTheme } from '@/theme/theme';

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light';
        }
        return 'light';
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prev) => {
                    const next = prev === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', next);
                    return next;
                });
            },
        }),
        [],
    );

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <QueryClientProvider client={queryClient}>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </QueryClientProvider>
    );
}
