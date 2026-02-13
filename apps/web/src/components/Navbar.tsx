'use client';

import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import { ColorModeContext } from '@/theme/theme';
import ThemeToggle from './ToggleButton';

interface NavbarProps {
    userName?: string;
    onLogout?: () => void;
    showUserControls?: boolean;
}

export default function Navbar({ userName, onLogout, showUserControls = false }: NavbarProps) {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const isDark = theme.palette.mode === 'dark';

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'transparent',
                borderBottom: 1,
                borderColor: 'divider',
                backdropFilter: 'blur(24px)',
                backgroundColor: isDark
                    ? 'rgba(15, 12, 41, 0.8)'
                    : 'rgba(255, 255, 255, 0.75)',
            }}
        >
            <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TaskAltOutlined
                        sx={{
                            fontSize: 28,
                            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            background: isDark
                                ? 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)'
                                : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        TaskFlow
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* User greeting */}
                {showUserControls && userName && (
                    <Typography
                        variant="body2"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center',
                            color: 'text.secondary',
                            fontWeight: 500,
                            height: 32, // Match switch height
                        }}
                    >
                        Hi, {userName} 👋
                    </Typography>
                )}

                {/* Theme toggle switch */}
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: 32 }}>
                        <LightMode
                            sx={{
                                fontSize: 18,
                                color: isDark ? 'text.secondary' : 'warning.main',
                                transition: 'color 0.3s',
                            }}
                        />
                    </Box>
                    <Switch
                        checked={isDark}
                        onChange={colorMode.toggleColorMode}
                        size="small"
                        slotProps={{ input: { 'aria-label': 'toggle dark mode' } as React.InputHTMLAttributes<HTMLInputElement> }}
                        sx={{
                            '& .MuiSwitch-switchBase': {
                                padding: 0,
                                top: 4,
                                left: 4,
                                '&.Mui-checked': {
                                    transform: 'translateX(14px)',
                                    '& + .MuiSwitch-track': {
                                        opacity: 1,
                                    },
                                },
                            },
                            '& .MuiSwitch-thumb': {
                                width: 14,
                                height: 14,
                                boxShadow: 'none',
                                bgcolor: isDark ? '#1a1a2e' : '#fbbf24',
                            },
                            '& .MuiSwitch-track': {
                                borderRadius: 10,
                                opacity: 1,
                                bgcolor: isDark ? '#4c4c6d' : '#e0e7ff',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', height: 32 }}>
                        <DarkMode
                            sx={{
                                fontSize: 18,
                                color: isDark ? '#a78bfa' : 'text.secondary',
                                transition: 'color 0.3s',
                            }}
                        />
                    </Box>
                </Box> */}
                <ThemeToggle isDark={isDark} toggleColorMode={colorMode.toggleColorMode} />

                {/* Logout */}
                {showUserControls && onLogout && (
                    <Tooltip title="Logout">
                        <IconButton
                            onClick={onLogout}
                            aria-label="Logout"
                            sx={{
                                ml: 1,
                                color: 'text.secondary',
                                '&:hover': { color: 'error.main' },
                            }}
                        >
                            <LogoutOutlined />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        </AppBar>
    );
}
