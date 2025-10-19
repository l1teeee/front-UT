export interface UserData {
    uid: string;
    email: string;
    displayName?: string | null;
    emailVerified: boolean;
    customToken?: string;
    lastSignInTime?: string;
    creationTime?: string;
}