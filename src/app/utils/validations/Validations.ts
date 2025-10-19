// utils/validations.ts
interface LoginFormData {
    email: string;
    password: string;
}

interface RegistrationFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const validateLoginForm = (formData: LoginFormData): string | null => {
    const { email, password } = formData;

    // Verificar campos requeridos
    if (!email || !password) {
        return 'Todos los campos son requeridos';
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Formato de email inválido';
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    return null; // Sin errores
};

export const validateRegistrationForm = (formData: RegistrationFormData): string | null => {
    const { name, email, password, confirmPassword } = formData;

    // Verificar campos requeridos
    if (!name || !email || !password || !confirmPassword) {
        return 'Todos los campos son requeridos';
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Formato de email inválido';
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }

    // Validar que el nombre tenga al menos 2 caracteres
    if (name.trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
    }

    return null; // Sin errores
};