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
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('Should save a user in MongoDB repository', async () => {
        const initialCount = await userRepo.getCount();
        const savedUser = await userRepo.save(testUser);
        const finalCount = await userRepo.getCount();

        expect(initialCount).toBe(finalCount - 1);
        expect(savedUser.userProps.firstName).toEqual(testUser.userProps.firstName);
        expect(savedUser.userProps.lastName).toEqual(testUser.userProps.lastName);
        expect(savedUser.userProps.email).toEqual(testUser.userProps.email);
        expect(savedUser.userProps.password).toEqual(testUser.userProps.password);
        expect(savedUser.userProps.role).toEqual(testUser.userProps.role);
    });

    it('Should return user via ID', async () => {
        await userRepo.save(testUser);
        const retrievedUser = await userRepo.getById(testUser.userProps.id);
        expect(retrievedUser.userProps.email).toEqual(testUser.userProps.email);
    });

    it('Should return user via Email', async () => {
        await userRepo.save(testUser);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retrievedUser = await userRepo.getByEmail(testUser.userProps.email);
        expect(retrievedUser.userProps.email).toEqual(testUser.userProps.email);
    });

    it('Should update user', async () => {
        const updatedEmail = `${v4()}@example.com`;
        testUser.update({ email: updatedEmail });

        await userRepo.save(testUser);
        const updatedUser = await userRepo.update(testUser);

        expect(updatedUser.userProps.email).toEqual(updatedEmail);
    });

    it("should delete user via id", async () => {
        await userRepo.save(testUser);
        const initialCount = await userRepo.getCount();
        await userRepo.delete(testUser.userProps.id);
        const finalCount = await userRepo.getCount();

        expect(initialCount).toBe(finalCount + 1);
        const userById = await userRepo.getById(testUser.userProps.id);
        expect(userById).toBeUndefined();
    });
});
