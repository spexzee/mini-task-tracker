import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

// Option 1: Sleek Sliding Toggle (Custom Built)
export default function ThemeToggle({ isDark, toggleColorMode }: { isDark: boolean, toggleColorMode: () => void }) {
    return (
        <Box
            onClick={toggleColorMode}
            sx={{
                position: 'relative',
                width: 56,
                height: 28,
                borderRadius: 14,
                bgcolor: isDark ? '#2d2d44' : '#e0e7ff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                px: 0.5,
            }}
        >
            {/* Sun Icon - Left */}
            <LightMode
                sx={{
                    fontSize: 16,
                    color: isDark ? 'rgba(255,255,255,0.3)' : '#f59e0b',
                    position: 'absolute',
                    left: 6,
                    transition: 'all 0.3s ease',
                }}
            />

            {/* Moon Icon - Right */}
            <DarkMode
                sx={{
                    fontSize: 16,
                    color: isDark ? '#a78bfa' : 'rgba(0,0,0,0.2)',
                    position: 'absolute',
                    right: 6,
                    transition: 'all 0.3s ease',
                }}
            />

            {/* Sliding Thumb */}
            <Box
                sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: isDark ? '#a78bfa' : '#fbbf24',
                    transform: isDark ? 'translateX(28px)' : 'translateX(0)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isDark
                        ? '0 2px 8px rgba(167, 139, 250, 0.4)'
                        : '0 2px 8px rgba(251, 191, 36, 0.4)',
                    zIndex: 1,
                }}
            />
        </Box>
    );
}