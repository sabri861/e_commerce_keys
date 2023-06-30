import {v4} from 'uuid';
import {MongoDbUserRepo} from "../repositories/mongoDb/MongoDbUserRepo";
import {User} from "../../../core/domain/entities/User";
import mongoose from "mongoose";
import {Role} from "../../../core/domain/ValueObject/Role";

describe('Integration: MongoDbUserRepo', () => {
    let userRepo: MongoDbUserRepo;
    let testUser: User;

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/KEYS');
        userRepo = new MongoDbUserRepo();
    });

    beforeEach(async () => {
        testUser = User.create({
            firstName: "Test",
            lastName: "User",
            email: `${v4()}@example.com`,
            password: "testPassword",
            role: Role.USER
        });

        await userRepo.save(testUser);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('Should save a user in MongoDB repository', async () => {
        const savedUser = await userRepo.getById(testUser.userProps.id);
        expect(savedUser.userProps.firstName).toEqual(testUser.userProps.firstName);
        expect(savedUser.userProps.lastName).toEqual(testUser.userProps.lastName);
        expect(savedUser.userProps.email).toEqual(testUser.userProps.email);
        expect(savedUser.userProps.password).toEqual(testUser.userProps.password);
        expect(savedUser.userProps.role).toEqual(testUser.userProps.role);
    });

    it('Should return user via ID', async () => {
        const retrievedUser = await userRepo.getById(testUser.userProps.id);
        expect(retrievedUser.userProps.email).toEqual(testUser.userProps.email);
    });

    it('Should return user via Email', async () => {
        const retrievedUser = await userRepo.getByEmail(testUser.userProps.email);
        expect(retrievedUser.userProps.email).toEqual(testUser.userProps.email);
    });

    it('Should update user', async () => {
        const updatedEmail = `${v4()}@example.com`;
        testUser.update({ email: updatedEmail });

        await userRepo.update(testUser);
        const updatedUser = await userRepo.getById(testUser.userProps.id);

        expect(updatedUser.userProps.email).toEqual(updatedEmail);
    });

    it('Should delete user via id', async () => {
        await userRepo.delete(testUser.userProps.id);
        await expect(userRepo.getById(testUser.userProps.id)).rejects.toThrow();
    });

});
