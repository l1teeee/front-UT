// app/hooks/useNavigation.ts
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ROUTES, type RoutePath } from '@/app/config/routes';

export function useNavigation() {
    const router = useRouter();
    const pathname = usePathname();

    // Navigation functions
    const goToDashboard = () => router.push(ROUTES.DASHBOARD);
    const goToLogin = () => router.push(ROUTES.LOGIN);
    const goToRegister = () => router.push(ROUTES.REGISTER);
    const goToProfile = () => router.push(ROUTES.PROFILE);
    const goToSettings = () => router.push(ROUTES.SETTINGS);
    const goHome = () => router.push(ROUTES.HOME);

    // Generic navigation
    const navigateTo = (route: RoutePath) => router.push(route);

    // Navigation with replace (no history entry)
    const replaceTo = (route: RoutePath) => router.replace(route);

    // Go back with fallback
    const goBack = (fallbackRoute: RoutePath = ROUTES.HOME) => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push(fallbackRoute);
        }
    };

    // Utility functions
    const isCurrentRoute = (route: RoutePath): boolean => pathname === route;
    const isAuthPage = (): boolean =>
        pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;

    return {
        // Basic navigation
        goToDashboard,
        goToLogin,
        goToRegister,
        goToProfile,
        goToSettings,
        goHome,

        // Advanced navigation
        navigateTo,
        replaceTo,
        goBack,

        // Utilities
        isCurrentRoute,
        isAuthPage,
        currentPath: pathname,
    };
}