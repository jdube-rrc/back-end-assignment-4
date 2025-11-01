// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/express";
import { AuthorizationError } from "../errors/errors";

/**
 * Middleware to check if a user is authorized based on their role or UID.
 * Now integrated with centralized error handling system.
 *
 * This middleware:
 * - Checks if the user has required roles
 * - Optionally allows users to access their own resources
 * - Throws standardized AuthorizationError for access denied scenarios
 *
 * @param {AuthorizationOptions} opts - The authorization options.
 * @returns {MiddlewareFunction} The middleware function.
 */
const isAuthorized = (opts: AuthorizationOptions): MiddlewareFunction => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role: rawRole, uid } = res.locals;
            const { id } = req.params;

            // Allow if the same user is accessing their own data
            if (opts.allowSameUser && id && uid === id) {
                return next();
            }

            // Normalize role(s) from various possible claim shapes
            const normalizeRoles = (r: unknown): string[] => {
                if (!r) return [];
                // string: "manager"
                if (typeof r === 'string') return [r.toLowerCase()];
                // array: ["manager"]
                if (Array.isArray(r)) return r.map(String).map(s => s.toLowerCase());
                // object: { role: 'manager' } or { roles: ['manager'] }
                if (typeof r === 'object') {
                    // @ts-ignore
                    const asAny = r as Record<string, any>;
                    if (asAny.role && typeof asAny.role === 'string') return [asAny.role.toLowerCase()];
                    if (asAny.roles && Array.isArray(asAny.roles)) return asAny.roles.map(String).map(s => s.toLowerCase());
                }
                return [];
            };

            const userRoles = normalizeRoles(rawRole);

            // If no role exists on the user, throw Forbidden response
            if (!userRoles || userRoles.length === 0) {
                throw new AuthorizationError(
                    "Forbidden: No role found",
                    "ROLE_NOT_FOUND"
                );
            }

            // Prepare allowed roles lowercased
            const allowed = opts.hasRole.map(r => r.toLowerCase());

            // Check for intersection between userRoles and allowed
            const intersects = userRoles.some(r => allowed.includes(r));
            if (intersects) return next();

            // If the role is not authorized, throw Forbidden response
            throw new AuthorizationError(
                "Forbidden: Insufficient role",
                "INSUFFICIENT_ROLE"
            );
        } catch (error) {
            // Pass errors to the centralized error handler
            next(error);
        }
    };
};

export default isAuthorized;
