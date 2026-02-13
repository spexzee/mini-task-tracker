import { useMutation } from '@tanstack/react-query';
import useApi from './useApi';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

export const useLoginMutation = () =>
    useMutation({
        mutationFn: (data: { email: string; password: string }) =>
            useApi<AuthResponse>('POST', '/api/auth/login', data),
    });

export const useSignupMutation = () =>
    useMutation({
        mutationFn: (data: { name: string; email: string; password: string }) =>
            useApi<AuthResponse>('POST', '/api/auth/signup', data),
    });

export type { User, AuthResponse };
