// app/hooks/useProtectedRoute.ts
'use client';

import { useEffect, useState } from 'react';
import { useNavigation } from '@/app/hook/useNavigation';
import localStorageService from '@/app/services/localStorageService';
import {RoutePath} from "@/app/config/routes";

interface UseProtectedRouteOptions {
    redirectTo?: string;
    requireAuth?: boolean;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
    const {
        redirectTo = '/pages/login',
        requireAuth = true
    } = options;

    const { navigateTo, currentPath } = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = () => {
            try {
                // Verificar autenticación usando tu localStorage service
                const authenticated = localStorageService.isAuthenticated();
                const user = localStorageService.getUser();

                console.log('Verificando autenticación:', {
                    authenticated,
                    user: user ? { email: user.email, uid: user.uid } : null,
                    currentPath,
                    requireAuth
                });

                setIsAuthenticated(authenticated);

                // Si requiere autenticación y no está autenticado
                if (requireAuth && !authenticated) {
                    console.log('Usuario no autenticado, redirigiendo a:', redirectTo);
                    navigateTo(redirectTo as RoutePath);
                    return;
                }

                // Si no requiere autenticación pero está autenticado (ej: páginas de login)
                if (!requireAuth && authenticated) {
                    console.log('Usuario ya autenticado, redirigiendo a dashboard');
                    navigateTo('/pages/dashboard' as RoutePath);
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                setIsAuthenticated(false);
                setIsLoading(false);

                if (requireAuth) {
                    navigateTo(redirectTo as RoutePath);
                }
            }
        };

        // Pequeño delay para evitar flash de redirección
        const timer = setTimeout(checkAuthentication, 100);

        return () => clearTimeout(timer);
    }, [currentPath, navigateTo, redirectTo, requireAuth]);

    return {
        isLoading,
        isAuthenticated,
        user: localStorageService.getUser()
    };
}