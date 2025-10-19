import  { UserData } from "@/app/types/localStorage";

class LocalStorageService {
    // Claves para localStorage
    private readonly USER_KEY = 'user';
    private readonly AUTH_TOKEN_KEY = 'authToken';

    // Verificar si localStorage está disponible (para SSR)
    private isLocalStorageAvailable(): boolean {
        try {
            return typeof window !== 'undefined' && window.localStorage !== null;
        } catch {
            return false;
        }
    }

    // ==================== FUNCIONES PARA LOGIN ====================

    /**
     * Guardar datos del usuario
     */
    setUser(userData: UserData): void {
        if (!this.isLocalStorageAvailable()) return;

        try {
            localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        } catch (error) {
            console.error('Error guardando usuario en localStorage:', error);
        }
    }

    /**
     * Obtener datos del usuario
     */
    getUser(): UserData | null {
        if (!this.isLocalStorageAvailable()) return null;

        try {
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error obteniendo usuario de localStorage:', error);
            return null;
        }
    }

    /**
     * Guardar token de autenticación
     */
    setAuthToken(token: string): void {
        if (!this.isLocalStorageAvailable()) return;

        try {
            localStorage.setItem(this.AUTH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Error guardando token en localStorage:', error);
        }
    }

    /**
     * Obtener token de autenticación
     */
    getAuthToken(): string | null {
        if (!this.isLocalStorageAvailable()) return null;

        try {
            return localStorage.getItem(this.AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Error obteniendo token de localStorage:', error);
            return null;
        }
    }

    /**
     * Guardar datos completos de login exitoso (FUNCIÓN PRINCIPAL USADA EN LOGIN)
     */
    saveLoginData(userData: UserData, authToken?: string): void {
        this.setUser(userData);

        if (authToken) {
            this.setAuthToken(authToken);
        }

        console.log('Datos guardados correctamente en localStorage');
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated(): boolean {
        const user = this.getUser();
        const token = this.getAuthToken();
        return !!(user && token);
    }

    // ==================== FUNCIONES DE LIMPIEZA ====================

    /**
     * Limpiar datos de autenticación (logout)
     */
    clearAuthData(): void {
        if (!this.isLocalStorageAvailable()) return;

        try {
            localStorage.removeItem(this.USER_KEY);
            localStorage.removeItem(this.AUTH_TOKEN_KEY);
            console.log('Datos de autenticación eliminados');
        } catch (error) {
            console.error('Error limpiando datos de auth:', error);
        }
    }

    /**
     * Logout completo
     */
    logout(): void {
        this.clearAuthData();
        console.log('Logout completado');
    }

    // ==================== FUNCIÓN DE DEBUG ====================

    /**
     * Obtener información del localStorage (para debug)
     */
    getStorageInfo(): object {
        if (!this.isLocalStorageAvailable()) {
            return { available: false };
        }

        return {
            available: true,
            user: this.getUser(),
            hasAuthToken: !!this.getAuthToken(),
            isAuthenticated: this.isAuthenticated()
        };
    }
}

// Exportar una instancia singleton
export const localStorageService = new LocalStorageService();
export default localStorageService;