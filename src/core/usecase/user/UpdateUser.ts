import {User} from "../../domain/entities/User";
import {Usecase} from "../Usecase";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {PasswordGateway} from "../../gateways/PasswordGateway";
import {Role} from "../../domain/ValueObject/Role";
import {Identity} from "../../domain/Identity"; // add this line

export interface UpdateUserProps {
    id: string;
    email?: string;
    password?: string;
}

export class UpdateUser implements Usecase<UpdateUserProps,User> {
    constructor(
        private userRepo: UserRepo,
        private passwordGateway: PasswordGateway,
    ) {}

    async execute(props: UpdateUserProps): Promise<User> {
        const existingUser = await this.userRepo.getById(props.id);
        if(!existingUser) {
            throw new Error("User not found")
        }
        if(props.password) {
            props.password = await this.passwordGateway.encrypt(props.password)
        }
        existingUser.update({email: props.email, password: props.password});
        await this.userRepo.update(existingUser);
        return existingUser;
    }

    async canExecute(identity: Identity, payload?: UpdateUserProps): Promise<boolean> {
        return identity.id === payload?.id;
    }

}
