import {Usecase} from "../Usecase";
import {User} from "../../domain/entities/User";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {Identity} from "../../domain/Identity";
import {inject, injectable} from "inversify";
import {KeysIdentifiers} from "../KeysIdentifiers";


export interface  GetUserByIdCommand {
    userId: string;
}

@injectable()
export class GetUserById implements Usecase<GetUserByIdCommand, User>{
    constructor(
        @inject(KeysIdentifiers.userRepo) private userRepo: UserRepo,
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