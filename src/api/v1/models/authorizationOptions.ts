export interface AuthorizationOptions {
    // include 'officer' role used by loan routes
    hasRole: Array<"admin" | "manager" | "user" | "officer">;
    allowSameUser?: boolean;
}
