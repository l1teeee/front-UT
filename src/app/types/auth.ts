export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        customToken: string;
        uid: string;
        email: string;
        displayName?: string;
        emailVerified: boolean;
        createdAt: string;
    };
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        uid: string;
        email: string;
        displayName?: string;
        emailVerified: boolean;
        customToken?: string;
        lastSignInTime?: string;
        creationTime?: string;
    };
}
