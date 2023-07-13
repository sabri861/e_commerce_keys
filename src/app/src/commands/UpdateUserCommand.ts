import {
    IsOptional,
    Length,
    IsEnum
} from 'class-validator';
import {Role} from "../../../core/domain/ValueObject/Role";

export class UpdateUserCommand {
    @IsOptional()
    @Length(1, 50)
    firstName?: string;

    @IsOptional()
    @Length(1, 50)
    lastName?: string;

    @IsOptional()
    @Length(1, 50)
    pseudo?: string;

    @IsOptional()
    @Length(8, 30)
    password?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
