import {Usecase} from "../Usecase";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {Identity} from "../../domain/Identity";

export class DeleteUser implements Usecase<string, void> {
    constructor(private userRepo: UserRepo) {}

    async execute(id: string): Promise<void> {
        await this.userRepo.delete(id);
    }

    async canExecute(identity: Identity): Promise<boolean> {

        if (identity.role >= 3) {
            return true;
        }
        return false;
    }
}