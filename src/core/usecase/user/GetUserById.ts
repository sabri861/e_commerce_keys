import {Usecase} from "../Usecase";
import {User} from "../../domain/entities/User";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {Identity} from "../../domain/Identity";


export interface  GetUserByIdCommand {
    userId: string;
}

export class GetUserById implements Usecase<GetUserByIdCommand, User>{
    constructor(
        private userRepo: UserRepo,
    ) {}

    async execute(command: GetUserByIdCommand): Promise<User>{
        const user = await this.userRepo.getById(command.userId)
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }

    async canExecute(identity: Identity): Promise<boolean> {
        if (identity.role === 3) {
            return true;
        }
        return false;
    }
}