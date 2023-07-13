import {
    IsEmail,
    Length,
    IsNotEmpty,
} from 'class-validator';

export class SignInCommand {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(8, 30, { message: 'Password must be between 8 and 30 characters' })
    password: string;
}
