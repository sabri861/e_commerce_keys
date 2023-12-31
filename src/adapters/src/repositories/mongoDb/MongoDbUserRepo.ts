import 'reflect-metadata';
import {UserRepo} from "../../../../core/domain/repositories/UserRepo";
import {MongoDbUserMapper, MongoDbUserMapperProps} from "../mappers/MongoDbUserMapper";
import {User} from "../../../../core/domain/entities/User";
import {UserModel} from "../models/UserModel";
import {injectable} from "inversify";

@injectable()
export class MongoDbUserRepo implements UserRepo {

    private mongoDbUserMappper: MongoDbUserMapper = new MongoDbUserMapper();
    async save(user: User): Promise<User> {

        await UserModel.findOneAndUpdate(
            {
                id: user.userProps.id
            },
            {
                $set: {
                    email: user.userProps.email,
                    firstName: user.userProps.firstName,
                    id: user.userProps.id,
                    lastName: user.userProps.lastName,
                    password: user.userProps.password,
                    pseudo: user.userProps.pseudo,
                    role: user.userProps.role,
                }
            },
            {
                upsert: true,
            }
        )
        return user;
    }

    async update(user: User): Promise<User> {
        await UserModel.findOneAndUpdate(
            {
                id: user.userProps.id
            },
            {
                $set: {
                    email: user.userProps.email,
                    firstName: user.userProps.firstName,
                    id: user.userProps.id,
                    lastName: user.userProps.lastName,
                    password: user.userProps.password,
                    pseudo: user.userProps.pseudo,
                    role: user.userProps.role,
                }
            },
            {
                upsert: true,
            }
        )
        return user;
    }

    async getByEmail(email: string): Promise<User> {
        const result: MongoDbUserMapperProps = await UserModel.findOne({
            email: email
        });


        if (result){
            const user = this.mongoDbUserMappper.toDomain(result);
            return user;
        }
    }

    async getById(id: string): Promise<User> {

        const result: MongoDbUserMapperProps = await UserModel.findOne({
            id: id
        });

        if (result){
            return this.mongoDbUserMappper.toDomain(result);
        }
    }

    async delete(id: string): Promise<void> {
        await UserModel.findOneAndDelete({id});
    }

    async getCount(): Promise<number> {
        return UserModel.countDocuments({});
    }

}