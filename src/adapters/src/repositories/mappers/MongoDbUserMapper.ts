import {Role} from "../../../../core/domain/ValueObject/Role";
import {Mapper} from "../../../../core/domain/Mapper";
import {User} from "../../../../core/domain/entities/User";

export interface MongoDbUserMapperProps {
    firstName: string;
    lastName: string;
    id : string;
    email : string;
    password : string;
    role : Role;
}

export class MongoDbUserMapper implements Mapper<User, MongoDbUserMapperProps>{
    toDomain(raw: MongoDbUserMapperProps): User {
        return new User({
            firstName: raw.firstName,
            lastName: raw.lastName,
            id : raw.id,
            email : raw.email,
            password : raw.password,
            role : raw.role
        });
    }
}