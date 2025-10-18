'use client';

import { usePathname } from 'next/navigation';
import { useNavigation } from '@/app/hook/useNavigation';

export default function FooterLinks() {
    const pathname = usePathname();
    const {goToRegister, goToLogin } = useNavigation();
    const isRegisterPage = pathname === '/register' || pathname === '/pages/register';

    return (
        <div className="mt-6 flex justify-end text-xs text-zinc-200 px-2">
            {isRegisterPage ? (
                <button
                    className="hover:text-zinc-500 transition-colors cursor-pointer"
                    onClick={goToLogin}
                >
                    ¿ya tienes cuenta?
                </button>
            ) : (
                <button
                    className="hover:text-zinc-500 transition-colors cursor-pointer"
                    onClick={goToRegister}
                >
                    registrarse
                </button>
            )}
        </div>
    );
}