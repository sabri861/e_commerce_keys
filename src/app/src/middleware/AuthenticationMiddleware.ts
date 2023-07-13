import 'reflect-metadata';
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { AuthenticatedRequest } from "../config/AuthenticatedRequest";
import { Request, Response, NextFunction } from "express";
import {inject, injectable} from "inversify";
import { KeysIdentifiers } from "../../../core/usecase/KeysIdentifiers";
import {JwtIdentityGateway} from "../../../adapters/src/gateways/JwtIdentityGateway";


@Middleware({ type: "before" })
@injectable()
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    private jwt: JwtIdentityGateway;

    constructor(@inject(KeysIdentifiers.tokenGateway) jwt: JwtIdentityGateway) {
        this.jwt = jwt;
    }


    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const identity = await this.jwt.decoded(token);
                (req as AuthenticatedRequest).identity = identity;
            } catch (error) {
                res.status(401).json({ message: "Invalid or expired token" });
                return;
            }
        }

        next();
    }
}
