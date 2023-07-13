import {
    JsonController,
    Get,
    Param,
    Body,
    Post,
    Put,
    Req, Delete, UnauthorizedError, Authorized, UseBefore,

} from "routing-controllers";
import { UserApiResponseDto } from "../../dtos/UserApiResponseDto";
import {SignUp} from "../../../../core/usecase/user/SignUp";
import {SignIn} from "../../../../core/usecase/user/SignIn";
import {AuthenticatedRequest} from "../../config/AuthenticatedRequest";
import {UpdateUser, UpdateUserProps} from "../../../../core/usecase/user/UpdateUser";
import {Role} from "../../../../core/domain/ValueObject/Role";
import {inject, injectable} from "inversify";
import {DeleteUser} from "../../../../core/usecase/user/DeleteUser";
import {GetUserById} from "../../../../core/usecase/user/GetUserById";
import {KeysIdentifiers} from "../../../../core/usecase/KeysIdentifiers";
import {JwtIdentityGateway} from "../../../../adapters/src/gateways/JwtIdentityGateway";
import {SendGridEmailGateway} from "../../../../adapters/src/gateways/SendGridEmailGateway";
import {BcryptPasswordGateway} from "../../../../adapters/src/gateways/BcryptPasswordGateway";
import {MongoDbUserRepo} from "../../../../adapters/src/repositories/mongoDb/MongoDbUserRepo";
import {Logger} from "../../config/Logger";
import {AuthenticationMiddleware} from "../../middleware/AuthenticationMiddleware";
import {UpdateUserCommand} from "../../commands/UpdateUserCommand";
import {SignInCommand} from "../../commands/SignInCommand";
import {SignUpCommand} from "../../commands/SignUpCommand";
import {response} from "express";

@JsonController("/users")
@injectable()
export class UserController {
    private readonly userApiResponseDto: UserApiResponseDto;

    constructor(
        @inject(KeysIdentifiers.userRepo) private userRepo: MongoDbUserRepo,
        @inject(KeysIdentifiers.passwordGateway) private passwordGateway: BcryptPasswordGateway,
        @inject(KeysIdentifiers.sendEmailGateway) private sendEmailGateway: SendGridEmailGateway,
        @inject(KeysIdentifiers.tokenGateway) private tokenGateway: JwtIdentityGateway,
        @inject(GetUserById) private readonly _getUserById: GetUserById,
        @inject(SignUp) private readonly _signUp: SignUp,
        @inject(SignIn) private readonly _signIn: SignIn,
        @inject(UpdateUser) private readonly _updateUser: UpdateUser,
        @inject(DeleteUser) private readonly _deleteUser: DeleteUser,
        @inject(KeysIdentifiers.logger) private logger: Logger,

    ) {
        this.userApiResponseDto = new UserApiResponseDto();
    }

    @UseBefore(AuthenticationMiddleware)
    @Get("/:id")
    async getById(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
        this.logger.info(`Getting user with ID: ${id}`);
        const canExecute = await this._getUserById.canExecute(req.identity);
        if (!canExecute) {
            this.logger.warn(`Unauthorized request to get user with ID: ${id}`);
            throw new UnauthorizedError();
        }
        const user = await this._getUserById.execute({userId: id});
        return this.userApiResponseDto.fromDomain(user);
    }

    @Post("/signup")
    async signUp(@Body() signUpCommand: SignUpCommand) {
        try{
        this.logger.info(`Signing up user with email: ${signUpCommand.email}`);
        const user = await this._signUp.execute(signUpCommand);
        const accessKey = await this.tokenGateway.generate(user);
        const userResponse = this.userApiResponseDto.fromDomain(user);
        return {
            ...userResponse,
            accessKey
        };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @Post("/signin")
    async signIn(@Body() signInCommand: SignInCommand) {
        try{
        this.logger.info(`Signing in user with email: ${signInCommand.email}`);
        const user = await this._signIn.execute(signInCommand);
        const accessKey = await this.tokenGateway.generate(user);
        const userResponse = this.userApiResponseDto.fromDomain(user);
        return {
            ...userResponse,
            accessKey
        };
    } catch (e){
            console.log(e);
            throw e;
        }
    }

    @UseBefore(AuthenticationMiddleware)
    @Put("/:id")
    async updateUser(@Req() req: AuthenticatedRequest, @Param("id") id: string, @Body() updateUserCommand: UpdateUserCommand) {
        this.logger.info(`Updating user with ID: ${id}`);
        const canExecute = await this._updateUser.canExecute(req.identity);
        if (!canExecute) {
            this.logger.warn(`Unauthorized request to update user with ID: ${id}`);
            throw new UnauthorizedError();
        }
        const updateUserProps: UpdateUserProps = {
            id,
            password: updateUserCommand.password,
            pseudo: updateUserCommand.pseudo
        };
        const updatedUser = await this._updateUser.execute(updateUserProps);
        return this.userApiResponseDto.fromDomain(updatedUser);
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete("/:id")
    async deleteUser(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
        this.logger.info(`Deleting user with ID: ${id}`);
        const canExecute = await this._deleteUser.canExecute(req.identity);
        if (!canExecute) {
            this.logger.warn(`Unauthorized request to delete user with ID: ${id}`);
            throw new UnauthorizedError();
        }
        await this._deleteUser.execute(id);
        return response.status(200);
    }

}
