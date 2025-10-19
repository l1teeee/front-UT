// authService.ts
import { RegisterResponse, LoginResponse } from '@/app/types/auth';

export const registerUser = async (
    name: string,
    email: string,
    password: string
): Promise<RegisterResponse> => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            displayName: name
        }),
    });

    const data: RegisterResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
    }

    if (!data.success) {
        throw new Error(data.message || 'Error en el registro');
    }

    return data;
};

export const loginUser = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
    }

    if (!data.success) {
        throw new Error(data.message || 'Error en el login');
    }

    return data;
};