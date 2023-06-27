import {Usecase} from "../Usecase";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {User} from "../../domain/entities/User";
import {Role} from "../../domain/ValueObject/Role";
import {Identity} from "../../domain/Identity";

export class DeleteUser implements Usecase<string, void> {
    constructor(private userRepo: UserRepo) {}

    async execute(id: string): Promise<void> {
        await this.userRepo.delete(id);
    }

    async canExecute(identity: Identity, id: string): Promise<boolean> {
        if(identity.role === Role.ADMIN || (identity.role >= Role.USER && identity.id === id)) {
            return true;
        }
        return false;
    }
}