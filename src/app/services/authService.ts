// authService.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/app/lib/firebase'; // Necesitas crear este archivo
import { RegisterResponse } from '@/app/types/auth';
import { FirebaseError } from 'firebase/app';

export const registerUser = async (
    name: string,
    email: string,
    password: string
): Promise<RegisterResponse> => {
    try {
        // Crear usuario con Firebase Client SDK (esto SÍ valida todo)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar el nombre del usuario
        await updateProfile(user, {
            displayName: name
        });

        // Obtener el token para el backend y localStorage
        const idToken = await user.getIdToken();

        // Retornar datos del usuario creado con token
        return {
            success: true,
            message: "Usuario registrado exitosamente",
            data: {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || name,
                emailVerified: user.emailVerified,
                customToken: idToken,
                createdAt: user.metadata.creationTime || new Date().toISOString()
            }
        };

    } catch (error: unknown) {
        console.error('Error en registro:', error);

        // Manejar errores específicos de Firebase
        let errorMessage = 'Error en el registro';

        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este email ya está registrado';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Registro con email/contraseña no habilitado';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }
        } else if (error instanceof Error) {
            // Manejar otros tipos de errores que no sean de Firebase
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{
    success: boolean;
    message: string;
    data: {
        uid: string;
        email: string;
        displayName: string | null;
        emailVerified: boolean;
        customToken: string;
        lastSignInTime: string;
        creationTime: string
    }
}> => {
    try {
        // AUTENTICACIÓN REAL con Firebase Client SDK
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener token de autenticación
        const idToken = await user.getIdToken();


        // Retornar datos del usuario autenticado
        return {
            success: true,
            message: "Login exitoso",
            data: {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName,
                emailVerified: user.emailVerified,
                customToken: idToken,
                lastSignInTime: user.metadata.lastSignInTime || new Date().toISOString(),
                creationTime: user.metadata.creationTime || new Date().toISOString()
            }
        };

    } catch (error: unknown) {
        console.error('Error en login:', error);

        let errorMessage = 'Error al iniciar sesión';

        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Usuario no encontrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'La cuenta está deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos. Intenta más tarde';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};