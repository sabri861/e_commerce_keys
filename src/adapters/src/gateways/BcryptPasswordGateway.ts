import {PasswordGateway} from "../../../core/gateways/PasswordGateway";
import {genSaltSync, hashSync, compare} from "bcrypt";

export class BcryptPasswordGateway implements PasswordGateway {
    async encrypt(password: string): Promise<string> {
        const salt = genSaltSync(10);
        return hashSync(password, salt);

    }

    async compare(password: string, hash: string): Promise<boolean> {
        return  await compare(password, hash);
    }
}
