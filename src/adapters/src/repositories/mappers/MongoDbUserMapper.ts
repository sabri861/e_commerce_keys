import {Mapper} from "../../../../core/domain/Mapper";
import {User} from "../../../../core/domain/entities/User";
import {userModel} from "../models/UserModel";


export class MongoDbUserMapper implements Mapper<User, userModel> {
    toDomain(raw: userModel): User {
        return  new User({
            id: raw.id,
            firstName: raw.firstName,
            lastName: raw.lastName,
            email: raw.email,
            password: raw.password,
            role: raw.role,
        });
    }


    fromDomain(user: User): userModel {
        return {
            id: user.userProps.id,
            firstName: user.userProps.firstName,
            lastName: user.userProps.lastName,
            email: user.userProps.email,
            password: user.userProps.password,
            role: user.userProps.role
        };
    }
}
