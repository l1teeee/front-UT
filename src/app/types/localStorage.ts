export interface UserData {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
    customToken?: string;
    lastSignInTime?: string;
    creationTime?: string;
}
