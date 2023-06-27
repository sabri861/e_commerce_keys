import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { dependencies } from "../config/dependencies";
import { AuthenticatedRequest } from "../config/AuthenticatedRequest";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "before" })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            console.log(token)
            try {
                const identity = await dependencies.jwt.decoded(token);
                (req as AuthenticatedRequest).identity = identity;
            } catch (error) {
                console.log(error)
                res.status(401).json({ message: "Invalid or expired token" });
                return;
            }
        }

        next();
    }
}
