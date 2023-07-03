import 'dotenv/config';
import {GetUserById} from "../../../core/usecase/user/GetUserById";
import {DeleteUser} from "../../../core/usecase/user/DeleteUser";
import {UpdateUser} from "../../../core/usecase/user/UpdateUser";
import {SignIn} from "../../../core/usecase/user/SignIn";
import {SignUp} from "../../../core/usecase/user/SignUp";
import {JwtIdentityGateway} from "../../../adapters/src/gateways/JwtIdentityGateway";
import {BcryptPasswordGateway} from "../../../adapters/src/gateways/BcryptPasswordGateway";
import {MongoDbUserRepo} from "../../../adapters/src/repositories/mongoDb/MongoDbUserRepo";
import {SendGridEmailGateway} from "../../../adapters/src/gateways/SendGridEmailGateway";
import * as process from "process";

const SgApiKey = process.env.SG_API_KEY;

const userRepository = new MongoDbUserRepo();
const passwordGateway = new BcryptPasswordGateway();
const sendGridGateway = new SendGridEmailGateway(SgApiKey);
const jwt = new JwtIdentityGateway(process.env.SECRET_KEY);

//
export const dependencies = {
    jwt: jwt,
    sendGridGateway: sendGridGateway,
    passwordGateway: passwordGateway,
    SignUp: new SignUp(userRepository, passwordGateway, sendGridGateway, jwt),
    signIn: new SignIn(userRepository, passwordGateway),
    updateUser: new UpdateUser(userRepository, passwordGateway),
    deleteUser: new DeleteUser(userRepository),
    getUserById: new GetUserById(userRepository),
};
