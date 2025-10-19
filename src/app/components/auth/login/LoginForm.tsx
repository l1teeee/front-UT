// components/auth/LoginForm.js
'use client';

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import SocialButtons from '@/app/components/auth/SocialButtons';
import { loginUser } from '@/app/services/authService';
import { validateLoginForm } from '@/app/utils/validations/Validations';
import localStorageService from '@/app/services/localStorageService';
import { useNavigation } from '@/app/hook/useNavigation';

export default function LoginForm() {
    const { goToDashboard } = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setIsSuccess(false);

        try {
            // Validaciones usando la función de validación
            const validationError = validateLoginForm({ email, password });
            if (validationError) {
                setError(validationError);
                return;
            }

            // Llamar al authService con Firebase Client SDK (autenticación REAL)
            const response = await loginUser(email, password);

            console.log('Login exitoso con Firebase Client SDK:', response);
            setIsSuccess(true);

            // Guardar datos usando el localStorage service
            if (response.data) {
                localStorageService.saveLoginData(
                    response.data,
                    response.data.customToken
                );

                console.log('Datos guardados en localStorage:', localStorageService.getStorageInfo());
            }

            // Limpiar formulario y redirigir después de 2 segundos
            setTimeout(() => {
                setEmail('');
                setPassword('');
                setIsSuccess(false);
                goToDashboard();
            }, 2000);

        } catch (error: unknown) {
            console.error('Error en login:', error);

            // Type guard to safely access error properties
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al iniciar sesión';

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="backdrop-blur-sm bg-black/40 border border-zinc-800/90 rounded-lg p-6 shadow-2xl">
            <div className="text-xs text-zinc-500 mb-5">login</div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={isLoading || isSuccess}
                        type="submit"
                        className={`w-full mt-5 px-3 py-2 text-xs font-medium border transition-all disabled:cursor-not-allowed rounded-sm ${
                            isSuccess
                                ? 'border-green-600 bg-green-600 text-white'
                                : 'border-zinc-700 bg-gradient-to-r from-zinc-900 to-black text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:shadow-lg disabled:opacity-50'
                        }`}
                    >
                        {isLoading ? '⟳ procesando...' : isSuccess ? '✓ correcto' : '→ acceder'}
                    </button>
                    <SocialButtons />
                </div>
            </form>
        </div>
    );
}