'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MuiLink from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import Fade from '@mui/material/Fade';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(160deg, #0f0c29 0%, #1a1a2e 40%, #302b63 100%)'
                        : 'linear-gradient(160deg, #faf5ff 0%, #f5f3ff 40%, #ede9fe 100%)',
            }}
        >
            <Navbar />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                }}
            >
                <Fade in timeout={600}>
                    <Container maxWidth="xs">
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: 1,
                                borderColor: 'divider',
                                backdropFilter: 'blur(24px)',
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(26, 26, 46, 0.6)'
                                        : 'rgba(255, 255, 255, 0.75)',
                                borderRadius: 4,
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                                        mx: 'auto',
                                        mb: 2,
                                        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
                                    }}
                                >
                                    <LoginOutlined sx={{ fontSize: 32, color: '#fff' }} />
                                </Box>
                                <Typography variant="h5" fontWeight={700}>
                                    Welcome Back
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={0.5}>
                                    Sign in to continue to TaskFlow
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    sx={{ mb: 2 }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                <TextField
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlined fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    sx={{ mb: 2 }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Box>

                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Don&apos;t have an account?{' '}
                                <MuiLink
                                    component={Link}
                                    href="/signup"
                                    sx={{ fontWeight: 600, color: 'primary.main' }}
                                >
                                    Sign up
                                </MuiLink>
                            </Typography>
                        </Paper>
                    </Container>
                </Fade>
            </Box>
        </Box>
    );
}
