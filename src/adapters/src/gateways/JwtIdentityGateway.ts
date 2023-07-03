import {TokenGateway} from "../../../core/gateways/TokenGateway";
import {Identity} from "../../../core/domain/Identity";
import {User} from "../../../core/domain/entities/User";
import {sign, verify} from "jsonwebtoken";
import {injectable} from "inversify";

@injectable()
export class JwtIdentityGateway implements TokenGateway {
    constructor(private secretKey: string) {}

    async generate(user: User): Promise<string> {
        const payload: Identity = {
            id: user.userProps.id,
            role: user.userProps.role,
        };
        return sign(payload, this.secretKey);
    }

    async decoded(token: string): Promise<Identity> {
        try {
            const decoded = verify(token, this.secretKey) as Identity;
            return {
                id: decoded.id,
                role: decoded.role
            };
        } catch (error) {
            throw new Error("Invalid token: " + error.message);
        }
    }

    async generateEmailConfirmationToken(user: User): Promise<string> {
        const payload: Identity = {
            id: user.userProps.id,
            role: user.userProps.role,
        };

        return sign(payload, this.secretKey, { expiresIn: '1d' });
    }
}
