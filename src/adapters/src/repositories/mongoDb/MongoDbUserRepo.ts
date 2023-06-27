import {UserRepo} from "../../../../core/domain/repositories/UserRepo";
import {MongoDbUserMapper} from "../mappers/MongoDbUserMapper";
import {User} from "../../../../core/domain/entities/User";
import {UserModel} from "../models/UserModel";


export class MongoDbUserRepo implements UserRepo {
    private mapper: MongoDbUserMapper = new MongoDbUserMapper();

    async getById(id: string): Promise<User | null> {
        try {
            const userDocument = await UserModel.findOne({ id });
            return userDocument ? this.mapper.toDomain(userDocument) : null;
        } catch (error) {
            throw new Error(`Error getting user by id: ${error.message}`);
        }
    }

    async getByEmail(email: string): Promise<User | null> {
        try {
            const userDocument = await UserModel.findOne({ email });
            return userDocument ? this.mapper.toDomain(userDocument) : null;
        } catch (error) {
            throw new Error(`Error getting user by email: ${error.message}`);
        }
    }

    async save(user: User): Promise<void> {
        try {
            const userPersistence = this.mapper.fromDomain(user);

            await UserModel.findOneAndUpdate(
                { id: user.userProps.id },
                { $set: userPersistence },
                { upsert: true }
            );
        } catch (error) {
            throw new Error(`Error saving user: ${error.message}`);
        }
    }

    async update(user: User): Promise<User> {
        try {
            const userPersistence = this.mapper.fromDomain(user);

            await UserModel.findOneAndUpdate(
                { id: user.userProps.id },
                { $set: userPersistence },
            );

            return user;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await UserModel.findOneAndDelete({ id });
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
}
