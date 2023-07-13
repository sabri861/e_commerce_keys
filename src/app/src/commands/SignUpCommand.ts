import {
    IsEmail,
    Length,
    IsEnum,
    IsOptional
} from 'class-validator';
import {Role} from "../../../core/domain/ValueObject/Role";


export class SignUpCommand {
    @IsOptional()
    @Length(1, 50)
    firstName?: string;

    @IsOptional()
    @Length(1, 50)
    lastName?: string;

    @IsOptional()
    @Length(1, 50)
    pseudo?: string;

    @IsEmail()
    @Length(1, 100)
    email: string;

    @Length(8, 30)
    password: string;

    @IsEnum(Role)
    role: Role;
}
