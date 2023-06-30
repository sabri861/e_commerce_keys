import {
    JsonController,
    Get,
    Param,
    Body,
    Post,
    Put,
    Res,
    Req, UseBefore, Delete,

} from "routing-controllers";
import { dependencies } from "../../config/dependencies";
import { UserApiResponseDto } from "../../domain/dtos/UserApiResponseDto";
import {SignUpProps} from "../../../../core/usecase/user/SignUp";
import {SignInProps} from "../../../../core/usecase/user/SignIn";

import {Response} from "express";
import {AuthenticatedRequest} from "../../config/AuthenticatedRequest";
import {UpdateUserProps} from "../../../../core/usecase/user/UpdateUser";
import {Role} from "../../../../core/domain/ValueObject/Role";
import {AuthenticationMiddleware} from "../../middleware/AuthenticationMiddleware";

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


    @UseBefore(AuthenticationMiddleware)
    @Put("/:id")
    async updateUser(@Req() req: AuthenticatedRequest, @Res() res: Response, @Param("id") id: string, @Body() updateUserProps: UpdateUserProps) {
        if (req.identity.id !== id && req.identity.role !== Role.ADMIN) {
            return res.status(401).send({message: "Unauthorized"});
        }

        const updatedUser = await dependencies.updateUser.execute({ id, ...updateUserProps });
        return res.status(200).send(this.userApiResponseDto.fromDomain(updatedUser));
    }

    @UseBefore(AuthenticationMiddleware)
    @Delete("/:id")
    async deleteUser(@Req() req: AuthenticatedRequest, @Res() res: Response, @Param("id") id: string) {
        if (req.identity.id !== id && req.identity.role !== Role.ADMIN) {
            return res.status(401).send({message: "Unauthorized"});
        }
        await dependencies.deleteUser.execute(id);
        return res.status(204).send();
    }

}
