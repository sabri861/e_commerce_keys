import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import { useExpressServer, Action } from "routing-controllers";
import { UserController } from "../modules/users/UserController";
import { dependencies } from "../config/dependencies";
import { Role } from "../../../core/domain/ValueObject/Role";
import {AuthenticationMiddleware} from "../middleware/AuthenticationMiddleware";

export function configureExpress(app: Application) {
    app.use(express.json());

    useExpressServer(app, {
        controllers: [UserController],
        middlewares: [AuthenticationMiddleware],
        authorizationChecker: async (action: Action, roles: string[]) => {
            const token = action.request.headers["authorization"];

            if (token) {
                console.log('Authorization Header:', token);
                try {
                    const identity = await dependencies.jwt.decoded(token);
                    console.log('Decoded Identity:', identity);

                    // Convertir les roles de string à enum Role
                    const roleEnums = roles.map(role => Role[role as keyof typeof Role]);

                    // L'admin a tous les droits
                    if (identity.role === Role.ADMIN) {
                        console.log('User is an ADMIN');
                        return true;
                    }

                    // Si le rôle de l'utilisateur est dans les rôles requis, autorisation est accordée
                    if (roleEnums.includes(identity.role)) {
                        console.log('User Role is in Required Roles');
                        return true;
                    }

                    console.log('Authorization Denied');
                    return false; // Sinon, l'autorisation est refusée
                } catch (error) {
                    console.error('Token Decoding Error:', error);
                    return false; // Si une erreur se produit lors du décodage du token, l'autorisation est refusée
                }
            }

            console.log('No Authorization Header Provided');
            return false; // Si aucun token n'est fourni, l'autorisation est refusée par défaut
        }
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send({ message: err.message });
    });
}
