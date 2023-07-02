import {Mapper} from "../../../core/domain/Mapper";
import {User} from "../../../core/domain/entities/User";
import {Role} from "../../../core/domain/ValueObject/Role";


interface UserAPIResponse {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: Role;
}

export class UserApiResponseDto implements Mapper<User, UserAPIResponse> {
    fromDomain(user: User): UserAPIResponse {
        return {
            id: user.userProps.id,
            firstName: user.userProps.firstName,
            lastName: user.userProps.lastName,
            email: user.userProps.email,
            role: user.userProps.role,
        };
    }
}
