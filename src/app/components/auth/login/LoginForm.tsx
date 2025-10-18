'use client';

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import InputField from '../InputField';
import ErrorMessage from '../ErrorMessage';
import SubmitButton from '../SubmitButton';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (!email || !password) {
                setError('campos requeridos');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('email inválido');
            } else {
                alert('✓ login exitoso');
                setEmail('');
                setPassword('');
            }
            setIsLoading(false);
        }, 500);
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
                <SubmitButton isLoading={isLoading} onClick={handleSubmit} />
            </div>
        </div>
    );
}