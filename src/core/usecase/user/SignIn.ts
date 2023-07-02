import {Usecase} from "../Usecase";
import {User} from "../../domain/entities/User";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {PasswordGateway} from "../../gateways/PasswordGateway";


export interface SignInProps {
    email: string;
    password: string;
}

export class SignIn implements Usecase<SignInProps, User>{
    constructor(
        private userRepo: UserRepo,
        private passwordGateway: PasswordGateway,
    ) {}

    async execute(props: SignInProps): Promise<User>{
        const userAlReadyExist = await this.userRepo.getByEmail(props.email)
        console.log("User from DB:", userAlReadyExist);
        console.log(JSON.stringify(userAlReadyExist))
        if(!userAlReadyExist){
            throw new Error("User does not exist");
        }
        const isPasswordValid = await this.passwordGateway.compare(props.password, userAlReadyExist.userProps.password)
        if(!isPasswordValid){
            throw new Error("Invalid password");
        }
        const user = new User({...userAlReadyExist.userProps});

        return user;
    }
}

