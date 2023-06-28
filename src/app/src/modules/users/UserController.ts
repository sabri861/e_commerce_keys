import {
    JsonController,
    Get,
    Param,
    Body,
    Post,
    Put,
    Res,
    Authorized,
    Req
} from "routing-controllers";
import { dependencies } from "../../config/dependencies";
import { UserApiResponseDto } from "../../domain/dtos/UserApiResponseDto";
import {SignUpProps} from "../../../../core/usecase/user/SignUp";
import {SignInProps} from "../../../../core/usecase/user/SignIn";
import {UpdateUserProps} from "../../../../core/usecase/user/UpdateUser";
import {Response} from "express";
import {AuthenticatedRequest} from "../../config/AuthenticatedRequest";

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
    @Put('/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserProps: UpdateUserProps,
        @Req() request: AuthenticatedRequest,
        @Res() response: Response
    ) {
        try {
            const canExecute = await dependencies.updateUser.canExecute(request.identity, {id: id, ...updateUserProps});
            if (!canExecute) {
                return response.status(403).json({ message: 'Forbidden' });
            }

            const user = await dependencies.updateUser.execute({id: id, ...updateUserProps});
            return response.status(200).json(user);
        } catch (err) {
            console.error(err);
            return response.status(500).json({ message: err.message });
        }
    }

}
