// components/auth/RegisterForm.js
'use client';

import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import SubmitButton from '../SubmitButton';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (!name || !email || !password || !confirmPassword) {
                setError('todos los campos son requeridos');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('email inválido');
            } else if (password.length < 6) {
                setError('contraseña debe tener al menos 6 caracteres');
            } else if (password !== confirmPassword) {
                setError('las contraseñas no coinciden');
            } else {
                alert('✓ registro exitoso');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="backdrop-blur-sm bg-black/40 border border-zinc-800/90 rounded-lg p-6 shadow-2xl">
            <div className="text-xs text-zinc-500 mb-5">registro</div>

            <div className="space-y-4">
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
                <SubmitButton isLoading={isLoading} onClick={handleSubmit} />
            </div>
        </div>
    );
}