// app/config/routes.ts
export const ROUTES = {
    // Auth pages
    LOGIN: '/pages/login',
    REGISTER: '/pages/register',

    HOME: '/',
    DASHBOARD: '/pages/dashboard',
    PROFILE: '/pages/profile',
    SETTINGS: '/pages/settings',

} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];