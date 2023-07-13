import 'reflect-metadata';
import {Usecase} from "../Usecase";
import {User} from "../../domain/entities/User";
import {UserRepo} from "../../domain/repositories/UserRepo";
import {PasswordGateway} from "../../gateways/PasswordGateway";
import {SendEmailGateway} from "../../gateways/SendEmailGateway";
import {Msg} from "../../domain/ValueObject/Msg";
import {TokenGateway} from "../../gateways/TokenGateway";
import {Role} from "../../domain/ValueObject/Role";
import {inject, injectable} from "inversify";
import {KeysIdentifiers} from "../KeysIdentifiers";


 export interface SignUpProps{
     firstName?: string;
     lastName?: string;
     pseudo?: string;
     email: string;
     password: string;
     role: Role;
}

@injectable()
export class SignUp implements Usecase<SignUpProps, User> {
    constructor(
        @inject(KeysIdentifiers.userRepo) private userRepo: UserRepo,
        @inject(KeysIdentifiers.passwordGateway) private passwordGateway: PasswordGateway,
        @inject(KeysIdentifiers.sendEmailGateway) private sendEmailGateway: SendEmailGateway,
        @inject(KeysIdentifiers.tokenGateway) private tokenGateway: TokenGateway

    ) {}
    async execute(props: SignUpProps): Promise<User>{
        const existingUser = await this.userRepo.getByEmail(props.email);
        if(existingUser){
            throw new Error("User already exists")
        }
        const hash = await this.passwordGateway.encrypt(props.password)

        const user = User.create({
            firstName: props.firstName,
            lastName: props.lastName,
            pseudo: props.pseudo,
            email: props.email,
            password: hash,
            role: props.role,
        })
        await this.userRepo.save(user);

        const token = this.tokenGateway.generateEmailConfirmationToken(user);

        const msg: Msg = {
            to: user.userProps.email,
            from: 'marwanecompany@gmail.com',
            subject: 'Welcome to our website ',
            text: `Please confirm your email by clicking the following link:`,
            html: `<p>Please confirm your email by clicking the following link: <a href='https://yourwebsite.com/confirm/${token}'>Confirm Email</a></p>`
        };

        await this.sendEmailGateway.send(msg)

        return user;
    }
}