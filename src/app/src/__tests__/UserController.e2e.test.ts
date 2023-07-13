import 'reflect-metadata';
import request from 'supertest';
import mongoose from 'mongoose';
import {Role} from "../../../core/domain/ValueObject/Role";
import {User} from "../../../core/domain/entities/User";
import {v4} from "uuid";
import {configureExpress} from "../config/express";
import express from "express";
import {AppDependencies} from "../config/AppDependencies";
import {KeysIdentifiers} from "../../../core/usecase/KeysIdentifiers";
import {JwtIdentityGateway} from "../../../adapters/src/gateways/JwtIdentityGateway";
import {SignUp} from "../../../core/usecase/user/SignUp";


const appDependencies = new AppDependencies();

appDependencies.init();
const signUp = appDependencies.get<SignUp>(SignUp);
const tokenGateway = appDependencies.get<JwtIdentityGateway>(KeysIdentifiers.tokenGateway);

describe('User Controller', () => {
    let user: User;
    let adminUser: User;
    let app: express.Application;
    let connection: mongoose.Connection;
    let token: string;
    let adminToken: string;

    beforeAll(async () => {
        await mongoose.connect(`mongodb://127.0.0.1:27017/KEYS`);
        connection = mongoose.createConnection("mongodb://127.0.0.1:27017/KEYS");
        app = express();
        configureExpress(app);
        user = await signUp.execute({
            email: `${v4()}jhon@doe.com`,
            password:  '@Zerty69Latrik3éflite__',
            pseudo: `jhon${v4()}`,
            role: Role.USER,
        });

        adminUser = await signUp.execute({
            email: `${v4()}admin@doe.com`,
            password: '@Zerty69Latrik3éflite__',
            pseudo: `admin${v4()}`,
            role: Role.ADMIN,
        });

        token = await tokenGateway.generate(user);
        adminToken = await tokenGateway.generate(adminUser);



    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

  it('should return 200 and responseDto signUp', async () => {
        const email = `${v4()}jhon@doe.com`
        const response = await request(app)
            .post('/users/signup')
            .send({
                email,
                password: '@Zerty69Latrik3éflite__',
                pseudo: `jhon${v4()}`,
                role: Role.USER,
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(email);
    });

    it('should return 200 and responseDto SignIn', async () => {
        const response = await request(app)
            .post('/users/signin')
            .send({
                email: user.userProps.email,
                password:  '@Zerty69Latrik3éflite__',
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(user.userProps.email);
    });

    it('should return 200 and responseDto id', async () => {
        const response = await request(app)
            .get(`/users/${user.userProps.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(user.userProps.id);
    });

    it('should return 200 and userProperties', async () => {
        const response = await request(app)
            .put(`/users/${user.userProps.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                email: `${v4()}admin@doe.com`,
                password: '@Zerty69Latrik3éflite__new',
                pseudo: `john-updated${v4()}`,
            });
        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(user.userProps.id);
        expect(response.body.email).toEqual(user.userProps.email);
    });

    it('should return 200', async () => {
        const response = await request(app)
            .delete(`/users/${user.userProps.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
    });




});
