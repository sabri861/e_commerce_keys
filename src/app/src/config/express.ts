import "reflect-metadata";
import express, { Application } from "express";
import {useExpressServer, Action, useContainer} from "routing-controllers";
import { UserController } from "../modules/users/UserController";
import {AppDependencies} from "./AppDependencies";


export function configureExpress(app: Application) {

    const routes = [UserController];

    const container = new AppDependencies().init();

    app.use(express.json());

    useContainer(container);

    useExpressServer(app, {

        controllers: routes
    })
}