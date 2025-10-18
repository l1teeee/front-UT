// app/config/routes.ts
export const ROUTES = {
    // Auth pages
    LOGIN: '/pages/login',
    REGISTER: '/pages/register',
    FORGOT_PASSWORD: '/pages/forgot-password',

    // Main pages
    HOME: '/',
    DASHBOARD: '/pages/dashboard',
    PROFILE: '/pages/profile',
    SETTINGS: '/pages/settings',

    // Add more as needed
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];