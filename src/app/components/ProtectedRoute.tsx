// app/components/ProtectedRoute.tsx
'use client';

import { ReactNode } from 'react';
import { useProtectedRoute } from '@/app/hook/useProtectedRoute';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
    loadingComponent?: ReactNode;
}

export default function ProtectedRoute({
                                           children,
                                           requireAuth = true,
                                           redirectTo = '/pages/login',
                                           loadingComponent
                                       }: ProtectedRouteProps) {
    const { isLoading, isAuthenticated } = useProtectedRoute({
        requireAuth,
        redirectTo
    });

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                {loadingComponent || (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-zinc-400 text-sm">Verificando autenticación...</p>
                    </div>
                )}
            </div>
        );
    }

    // Si requiere auth y no está autenticado, no renderizar nada (ya redirigió)
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    // Si no requiere auth pero está autenticado, no renderizar nada (ya redirigió)
    if (!requireAuth && isAuthenticated) {
        return null;
    }

    // Renderizar el contenido si pasa las validaciones
    return <>{children}</>;
}