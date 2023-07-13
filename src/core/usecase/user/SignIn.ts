import {Usecase} from "../Usecase";
import {User} from "../../domain/entities/User";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {PasswordGateway} from "../../gateways/PasswordGateway";
import {inject, injectable} from "inversify";
import {KeysIdentifiers} from "../KeysIdentifiers";
import {AuthenticationError} from "../../domain/errors/AuthenticationError";


export interface SignInProps {
    email: string;
    password: string;
}

@injectable()
export class SignIn implements Usecase<SignInProps, User>{
    constructor(
        @inject(KeysIdentifiers.userRepo) private userRepo: UserRepo,
        @inject(KeysIdentifiers.passwordGateway) private passwordGateway: PasswordGateway,
    ) {}

    async execute(props: SignInProps): Promise<User>{
        const userAlReadyExist = await this.userRepo.getByEmail(props.email)
        if(!userAlReadyExist){
            throw new AuthenticationError.SignInFailed("SIGNIN_FAILED");
        }
        const isPasswordValid = await this.passwordGateway.compare(props.password, userAlReadyExist.userProps.password)
        if(!isPasswordValid){
            throw new AuthenticationError.SignInFailed("SIGNIN_FAILED");
        }
        const user = new User({...userAlReadyExist.userProps});

        return user;
    }
}