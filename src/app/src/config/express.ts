import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import { useExpressServer } from "routing-controllers";
import { UserController } from "../modules/users/UserController";

export function configureExpress(app: Application) {
    app.use(express.json());

    useExpressServer(app, {
        controllers: [UserController]
    });
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
}
