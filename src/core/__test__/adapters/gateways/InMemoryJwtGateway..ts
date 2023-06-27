import {TokenGateway} from "../../../gateways/TokenGateway";
import {User} from "../../../domain/entities/User";
import {Identity} from "../../../domain/Identity";
import {Role} from "../../../domain/ValueObject/Role";

export class InMemoryJwtGateway implements TokenGateway {
    generate(user: User): Promise<string> {
        return Promise.resolve("TokenGenerer");
    }

    decoded(token: string): Promise<Identity> {
        return Promise.resolve({
            id: "123456",
            email:"john@doe.fr",
            role: Role.USER,
        });
    }

    generateEmailConfirmationToken(user: User): Promise<string> {
        return Promise.resolve("EmailConfirmationToken");
    }
}
