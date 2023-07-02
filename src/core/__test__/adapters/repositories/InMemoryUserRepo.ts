import {UserRepo} from "../../../domain/repositories/UserRepo";
import {User} from "../../../domain/entities/User";


export class InMemoryUserRepo implements UserRepo{
    private users: User[] = [];

    async getById (id:string): Promise<User>{
        return this.users.find(user => user.userProps.id === id);

    }

    async getByEmail(email:string): Promise<User>{
        return this.users.find(user => user.userProps.email === email);
    }

    async save(user: User): Promise<User>{
        this.users.push(user);
        return user;
    }


    async update(user: User): Promise<User>{
        const index = this.users.findIndex((u) => u.userProps.id === user.userProps.id);
        if (index === -1){
            throw new Error('User not found');
        }
        this.users[index] = user;
        return user;
    }
    async delete(id: string): Promise<void> {
        const index = this.users.findIndex(user => user.userProps.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }
}