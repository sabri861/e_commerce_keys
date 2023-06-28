import 'reflect-metadata';
import {createExpressServer} from 'routing-controllers';
import request from 'supertest';
import mongoose from 'mongoose';
import {Role} from "../../../core/domain/ValueObject/Role";
import {UserController} from "../modules/users/UserController";
import {dependencies} from "../config/dependencies";
import {User} from "../../../core/domain/entities/User";
import {v4} from "uuid";




let user: User;
let app: Express.Application;
let connection: mongoose.Connection;
let token: string;

describe('User Controller', () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://127.0.0.1:27017/KEYS`);
        connection = mongoose.createConnection("mongodb://127.0.0.1:27017/KEYS");
        app = createExpressServer({
            controllers: [UserController]
        });
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
            .set("authorization", token)

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(user.userProps.id);
    });

    it('should update a user', async () => {
        const newEmail = `${v4()}jhon@doe.com`;
        const response = await request(app)
            .put(`/users/${user.userProps.id}`)
            .set("authorization", `Bearer ${token}`)
            .send({
                email: newEmail,
            });

        expect(response.status).toBe(200);
        expect(response.body.email).toEqual(newEmail);
    });



});
