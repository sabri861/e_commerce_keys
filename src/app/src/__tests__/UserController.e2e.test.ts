import 'reflect-metadata';
import request from 'supertest';
import mongoose from 'mongoose';
import {Role} from "../../../core/domain/ValueObject/Role";
import {dependencies} from "../config/dependencies";
import {User} from "../../../core/domain/entities/User";
import {v4} from "uuid";
import {configureExpress} from "../config/express";
import express from "express";

let user: User;
let app: express.Application;
let connection: mongoose.Connection;
let token: string;

describe('User Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://127.0.0.1:27017/KEYS`);
        connection = mongoose.createConnection("mongodb://127.0.0.1:27017/KEYS");
        app = express();
        configureExpress(app);
        user = await dependencies.SignUp.execute({
            email: `${v4()}jhon@doe.com`,
            password: '@Zerty',
            role: Role.USER,
        });

        token = await dependencies.jwt.generate(user)
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should sign up a user', async () => {
        const email = `${v4()}jhon@doe.com`
        const response = await request(app)
            .post('/users/signup')
            .send({
                email,
                password: '@Zerty' ,
                role: Role.USER,
            });

        expect(response.status).toBe(201);
        expect(response.body.email).toEqual(email);
    });

    it('should sign in a user', async () => {
        const response = await request(app)
            .post('/users/signin')
            .send({
                email: user.userProps.email,
                password: '@Zerty' ,
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(user.userProps.email);
    });


    it('should get a user by id', async () => {
        const response = await request(app)
            .get(`/users/${user.userProps.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(user.userProps.id);
    });

    it('should not allow a non-admin user to update another user', async () => {
        const anotherUser = await dependencies.SignUp.execute({
            email: `${v4()}another@doe.com`,
            password: '@Zerty',
            role: Role.USER,
        });

        const response = await request(app)
            .put(`/users/${anotherUser.userProps.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: "newemail@example.com",
            });

        expect(response.status).toBe(401);
    });

    it('should allow a user to update their own email and password', async () => {
        const newEmail = "newemail@example.com";
        const newPassword = "newpassword";

        const response = await request(app)
            .put(`/users/${user.userProps.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                email: newEmail,
                password: newPassword,
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(newEmail);

        const updatedUser = await dependencies.getUserById.execute({userId: user.userProps.id});
        const isMatch = await dependencies.passwordGateway.compare(newPassword, updatedUser.userProps.password);

        expect(isMatch).toBe(true);
    });
});
