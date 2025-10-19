// components/auth/RegisterForm.js
'use client';

import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import SocialButtons from '@/app/components/auth/SocialButtons';
import { registerUser } from '@/app/services/authService';
import { validateRegistrationForm } from '@/app/utils/validations/Validations';
import localStorageService from '@/app/services/localStorageService';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            const validationError = validateRegistrationForm({
                name,
                email,
                password,
                confirmPassword
            });

            if (validationError) {
                setError(validationError);
                return;
            }

            // Usar el authService con Firebase Client SDK
            const response = await registerUser(name, email, password);

            console.log('Registro exitoso:', response);
            setIsSuccess(true);

            // Guardar datos usando el localStorage service
            if (response.data) {
                localStorageService.saveLoginData(
                    response.data,
                    response.data.customToken
                );

                console.log('Datos guardados en localStorage:', localStorageService.getStorageInfo());
            }

            // Limpiar el formulario después de 2 segundos
            setTimeout(() => {
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsSuccess(false);

                // Opcional: Redirigir al dashboard o login
                // window.location.href = '/dashboard';
            }, 2000);

        } catch (error: any) {
            console.error('Error en registro:', error);
            setError(error.message || 'Error al registrar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="backdrop-blur-sm bg-black/40 border border-zinc-800/90 rounded-lg p-6 shadow-2xl">
            <div className="text-xs text-zinc-500 mb-5">registro</div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    icon={User}
                    label="nombre"
                    type="text"
                    placeholder="tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <InputField
                    icon={Lock}
                    label="confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {isLoading ? '⟳ procesando...' : isSuccess ? '✓ registrado' : '→ registrar'}
                    </button>
                    <SocialButtons />
                </div>
            </form>
        </div>
    );
}