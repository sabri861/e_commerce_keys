import {UserRepo} from "../../../../core/domain/repositories/UserRepo";
import {MongoDbUserMapper} from "../mappers/MongoDbUserMapper";
import {User} from "../../../../core/domain/entities/User";
import {UserModel} from "../models/UserModel";

export class MongoDbUserRepo implements UserRepo {
    private mapper: MongoDbUserMapper = new MongoDbUserMapper();

    async getById(id: string): Promise<User> {
        const userDocument = await UserModel.findOne({ id });
        if (!userDocument) {
            throw new Error(`User with id ${id} not found`);
        }
        return this.mapper.toDomain(userDocument);
    }

    async getByEmail(email: string): Promise<User> {
        const userDocument = await UserModel.findOne({ email });
        if (!userDocument) {
            throw new Error(`User with email ${email} not found`);
        }
        return this.mapper.toDomain(userDocument);
    }

    async save(user: User): Promise<void> {
        const userPersistence = this.mapper.fromDomain(user);
        await UserModel.findOneAndUpdate(
            { id: user.userProps.id },
            { $set: userPersistence },
            { upsert: true }
        );
    }

    async update(user: User): Promise<User> {
        const userPersistence = this.mapper.fromDomain(user);
        await UserModel.findOneAndUpdate(
            { id: user.userProps.id },
            { $set: userPersistence },
        );
        return user;
    }

    async delete(id: string): Promise<void> {
        await UserModel.findOneAndDelete({ id });
    }
}
