import {Container} from "inversify";
import {KeysIdentifiers} from "../../../core/usecase/KeysIdentifiers";
import {MongoDbUserRepo} from "../../../adapters/src/repositories/mongoDb/MongoDbUserRepo";
import {SignUp} from "../../../core/usecase/user/SignUp";
import {UserController} from "../modules/users/UserController";
import {BcryptPasswordGateway} from "../../../adapters/src/gateways/BcryptPasswordGateway";
import {SendGridEmailGateway} from "../../../adapters/src/gateways/SendGridEmailGateway";
import {JwtIdentityGateway} from "../../../adapters/src/gateways/JwtIdentityGateway";
import process from "process";
import {AuthenticationMiddleware} from "../middleware/AuthenticationMiddleware";

const SgApiKey = process.env.SG_API_KEY;

export class AppDependencies extends Container {
    init(){
        this.bind(KeysIdentifiers.userRepo).toConstantValue(new MongoDbUserRepo());
        this.bind(KeysIdentifiers.passwordGateway).toConstantValue(new BcryptPasswordGateway());
        this.bind(KeysIdentifiers.sendEmailGateway).toConstantValue(new SendGridEmailGateway(SgApiKey));
        this.bind(KeysIdentifiers.tokenGateway).toConstantValue(new JwtIdentityGateway(process.env.SECRET_KEY));
        this.bind(SignUp).toSelf();
        this.bind(UserController).toSelf();
        this.bind(AuthenticationMiddleware).toSelf();

        return this;
    }
}
