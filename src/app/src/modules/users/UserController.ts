import {JsonController, Get, Param, Body, Post, Put, Delete, Res, Authorized, CurrentUser} from "routing-controllers";
import { dependencies } from "../../config/dependencies";
import { UserApiResponseDto } from "../../domain/dtos/UserApiResponseDto";
import {SignUpProps} from "../../../../core/usecase/user/SignUp";
import {SignInProps} from "../../../../core/usecase/user/SignIn";
import {UpdateUserProps} from "../../../../core/usecase/user/UpdateUser";
import {Response} from "express";
import {Identity} from "../../../../core/domain/Identity";

@JsonController("/users")
export class UserController {
    private readonly userApiResponseDto: UserApiResponseDto;
    constructor() {
        this.userApiResponseDto = new UserApiResponseDto();
    }

    @Get("/:id")
    async getById(@Param("id") id: string) {
        const user = await dependencies.getUserById.execute({userId: id});
        return this.userApiResponseDto.fromDomain(user);
    }

    @Post("/signup")
    async signUp(@Res() res: Response, @Body() userProps: SignUpProps) {
        const user = await dependencies.SignUp.execute(userProps);
        const accessKey = await dependencies.jwt.generate(user);
        const userResponse = this.userApiResponseDto.fromDomain(user);
        return res.status(201).send({
            ...userResponse,
            accessKey
        });
    }

    @Post("/signin")
    async signIn(@Res() res: Response, @Body() signInProps: SignInProps) {
        const user = await dependencies.signIn.execute(signInProps);
        const accessKey = await dependencies.jwt.generate(user);
        const userResponse = this.userApiResponseDto.fromDomain(user);
        return res.status(200).send({
            ...userResponse,
            accessKey
        });
    }

    @Authorized()
    @Put("/:id")
    async update(@Res() res: Response, @Param("id") id: string, @Body() updateUserProps: UpdateUserProps, @CurrentUser() currentUser: Identity) {
        try {
            console.log('Checking if user can execute update...');
            const canExecute = await dependencies.updateUser.canExecute(currentUser, {id: id, ...updateUserProps});
            if (!canExecute) {
                return res.status(403).send({ message: 'Unauthorized' });
            }
            const updatedUser = await dependencies.updateUser.execute({id: id, ...updateUserProps});
            const responseDto = this.userApiResponseDto.fromDomain(updatedUser);
            return res.status(200).send({
                response: responseDto,

            });
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: error });
        }

    }


    @Authorized()
    @Delete("/:id")
    async delete(@Res() res: Response, @Param("id") id: string, @CurrentUser() currentUser: Identity) {
        try {
            if (currentUser.id !== id) {
                return res.status(403).send({ message: 'Unauthorized' });
            }


            const identity: Identity = {
                id: currentUser.id,
                role: currentUser.role,
            };

            const canExecute = await dependencies.deleteUser.canExecute(identity, id);

            if (!canExecute) {
                return res.status(403).send({ message: 'Unauthorized' });
            }

            await dependencies.deleteUser.execute(id);
            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Internal server error' });
        }
    }

}
