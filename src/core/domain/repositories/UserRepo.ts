import {User,} from "../entities/User";

export interface UserRepo {
    getById(id: string): Promise<User>;
    getByEmail(email: string): Promise<User>;
    save(user: User): Promise<void>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}