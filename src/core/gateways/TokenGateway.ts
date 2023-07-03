import {Identity} from "../domain/Identity";
import {User} from "../domain/entities/User";




export interface TokenGateway {
    generate(user: User) : Promise<string>;
    decoded(token: string): Promise<Identity>;
    generateEmailConfirmationToken(user: User): Promise<string>;
}
