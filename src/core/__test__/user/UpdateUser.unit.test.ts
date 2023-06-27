import {InMemoryUserRepo} from "../adapters/repositories/InMemoryUserRepo";
import {UpdateUser} from "../../usecase/user/UpdateUser";
import {InMemoryPasswordGateway} from "../adapters/gateways/InMemoryPasswordGateway";
import {SignUp} from "../../usecase/user/SignUp";
import {User} from "../../domain/entities/User";
import {InMemoryJwtGateway} from "../adapters/gateways/InMemoryJwtGateway.";
import {InMemorySendEmailGateway} from "../adapters/gateways/InMemorySendEmailGateway";
import {Role} from "../../domain/ValueObject/Role";


describe("Unit-UpdateUser", () => {
    let userRepo: InMemoryUserRepo;
    let updateUser: UpdateUser;
    let passwordGateway: InMemoryPasswordGateway;
    let signUp: SignUp;
    let user: User;
    let sendEmailGateway;
    let tokenGateway;

    beforeAll(async () => {
        userRepo = new InMemoryUserRepo();
        passwordGateway = new InMemoryPasswordGateway();
        sendEmailGateway = new InMemorySendEmailGateway();
        tokenGateway = new InMemoryJwtGateway();
        updateUser = new UpdateUser(userRepo, passwordGateway);
        signUp = new SignUp(userRepo, passwordGateway,sendEmailGateway, tokenGateway);

        user = await signUp.execute({
            firstName: "John",
            lastName: "Doe",
            email: "john@doe.fr",
            password: "azerty",
            role: Role.USER
        });
    });

    it("Should update a user's email", async () => {
        const updatedUser = await updateUser.execute({
            id: user.userProps.id,
            email: "jane@doe.fr"
        });

        expect(updatedUser.userProps.email).toEqual("jane@doe.fr");
    });

    it("Should update a user's password", async () => {
        const updatedUser = await updateUser.execute({
            id: user.userProps.id,
            password: "qwerty",
        });

        const passwordMatches = await passwordGateway.compare("qwerty", updatedUser.userProps.password);
        expect(passwordMatches).toEqual(true);
    });

    it("Should throw an error if user not found", async () => {
        await expect(updateUser.execute({
            id: "non-existing-id",
            email: "jane@doe.fr"
        })).rejects.toThrow("User not found");
    });

    it("Admin can update any user", async () => {
        const admin = new User({id: "admin-id", email: "admin@doe.fr", password: "qwerty", role: Role.ADMIN});
        const canUpdate = await updateUser.canExecute(admin.userProps, {id: user.userProps.id});
        expect(canUpdate).toBe(true);
    });

    it("User can update self", async () => {
        const canUpdate = await updateUser.canExecute(user.userProps, {id: user.userProps.id});
        expect(canUpdate).toBe(true);
    });

    it("User cannot update other user", async () => {
        const otherUser = new User({id: "other-id", email: "other@doe.fr", password: "qwerty", role: Role.USER});
        const canUpdate = await updateUser.canExecute(otherUser.userProps, {id: user.userProps.id});
        expect(canUpdate).toBe(false);
    });
});
