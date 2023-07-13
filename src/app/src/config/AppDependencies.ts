import 'reflect-metadata';
import 'dotenv/config';
import {Container} from "inversify";
import {KeysIdentifiers} from "../../../core/usecase/KeysIdentifiers";
import {MongoDbUserRepo} from "../../../adapters/src/repositories/mongoDb/MongoDbUserRepo";
import {SignUp} from "../../../core/usecase/user/SignUp";
import {SignIn} from "../../../core/usecase/user/SignIn";
import {UpdateUser} from "../../../core/usecase/user/UpdateUser";
import {DeleteUser} from "../../../core/usecase/user/DeleteUser";
import {GetUserById} from "../../../core/usecase/user/GetUserById";
import {BcryptPasswordGateway} from "../../../adapters/src/gateways/BcryptPasswordGateway";
import {JwtIdentityGateway} from "../../../adapters/src/gateways/JwtIdentityGateway";
import process from "process";
import {SendGridEmailGateway} from "../../../adapters/src/gateways/SendGridEmailGateway";
import {AuthenticationMiddleware} from "../middleware/AuthenticationMiddleware";
import {Logger} from "./Logger";
import {UserController} from "../modules/users/UserController";

const SgApiKey = process.env.SG_API_KEY;

export class AppDependencies extends Container {
    init(){
        this.bind(KeysIdentifiers.userRepo).toConstantValue(new MongoDbUserRepo());
        this.bind(KeysIdentifiers.passwordGateway).toConstantValue(new BcryptPasswordGateway());
        this.bind(KeysIdentifiers.sendEmailGateway).toConstantValue(new SendGridEmailGateway(SgApiKey));
        this.bind(KeysIdentifiers.tokenGateway).toConstantValue(new JwtIdentityGateway(process.env.SECRET_KEY));
        this.bind(KeysIdentifiers.logger).toConstantValue(new Logger(process.env.LOG_LEVEL));
        this.bind(SignUp).toSelf();
        this.bind(SignIn).toSelf();
        this.bind(UpdateUser).toSelf();
        this.bind(DeleteUser).toSelf();
        this.bind(GetUserById).toSelf();
        this.bind(AuthenticationMiddleware).toSelf();
        this.bind(Container).toConstantValue(this);
        this.bind(UserController).toSelf();


        return this;
    }
}
