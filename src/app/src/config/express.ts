import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import { useExpressServer, Action } from "routing-controllers";
import { UserController } from "../modules/users/UserController";
import { dependencies } from "../config/dependencies";
import { Role } from "../../../core/domain/ValueObject/Role";
import {AuthenticationMiddleware} from "../middleware/AuthenticationMiddleware";


export function configureExpress(app: Application) {

    const routes = [UserController];

    app.use(express.json());



    useExpressServer(app, {

        controllers: routes
    })
}