'use client';

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import SocialButtons from '@/app/components/auth/SocialButtons';
import { AuthService, AuthError } from '@/app/services/authService';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validaciones básicas del lado cliente
            if (!email || !password) {
                setError('Campos requeridos');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Email inválido');
                return;
            }

            // Llamar al servicio de login
            const response = await AuthService.login(email, password);

            // Login exitoso
            console.log('🎉 Respuesta del servidor:', response);
            alert(`✓ Login exitoso para: ${response.correo}`);

            // Limpiar el formulario
            setEmail('');
            setPassword('');

        } catch (error) {
            if (error instanceof AuthError) {
                // Error de la API
                const errorMessage = error.detalles || error.message;
                setError(errorMessage);
                console.error('Error de login:', error);
            } else {
                // Error inesperado
                setError('Error inesperado. Intenta de nuevo.');
                console.error('Error inesperado:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="backdrop-blur-sm bg-black/40 border border-zinc-800/90 rounded-lg p-6 shadow-2xl">
            <div className="text-xs text-zinc-500 mb-5">login</div>

            <div className="space-y-4">
                <InputField
                    icon={Mail}
                    label="email"
                    type="email"
                    placeholder="nombre@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <InputField
                    icon={Lock}
                    label="contraseña"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <ErrorMessage error={error} />

                <div>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full mt-5 px-3 py-2 text-xs font-medium border border-zinc-700 bg-gradient-to-r from-zinc-900 to-black text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                        {isLoading ? '⟳ procesando...' : '→ acceder'}
                    </button>
                    <SocialButtons />
                </div>
            </div>
        </div>
    );
}