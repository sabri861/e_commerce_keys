import {Role} from "../../domain/ValueObject/Role";
import {InMemoryUserRepo} from "../adapters/repositories/InMemoryUserRepo";
import {DeleteUser} from "../../usecase/user/DeleteUser";
import {SignUp} from "../../usecase/user/SignUp";
import {User} from "../../domain/entities/User";
import {InMemorySendEmailGateway} from "../adapters/gateways/InMemorySendEmailGateway";
import {InMemoryJwtGateway} from "../adapters/gateways/InMemoryJwtGateway.";
import {InMemoryPasswordGateway} from "../adapters/gateways/InMemoryPasswordGateway";


describe("Unit-DeleteUser", () => {
    let userRepo: InMemoryUserRepo;
    let deleteUser: DeleteUser;
    let signUp: SignUp;
    let user: User;
    let sendEmailGateway;
    let tokenGateway;
    let passwordGateway;

    beforeAll(async () => {
        userRepo = new InMemoryUserRepo();
        sendEmailGateway = new InMemorySendEmailGateway();
        tokenGateway = new InMemoryJwtGateway();
        passwordGateway = new InMemoryPasswordGateway();
        deleteUser = new DeleteUser(userRepo);
        signUp = new SignUp(userRepo, passwordGateway,sendEmailGateway, tokenGateway);

        user = await signUp.execute({
            email: "john@doe.fr",
            password: "azerty",
            role: Role.USER
        });
    });
    it("Should allow a user to delete their own account", async () => {
        const canDelete = await deleteUser.canExecute(user.userProps, user.userProps.id);
        expect(canDelete).toEqual(true);
        await deleteUser.execute(user.userProps.id);
        const deletedUser = await userRepo.getById(user.userProps.id);
        expect(deletedUser).toBeUndefined();
    });

    it("Should not allow a user to delete someone else's account", async () => {
        const otherUser = await signUp.execute({
            email: "jane@doe.fr",
            password: "qwerty",
            role: Role.USER
        });
        const canDelete = await deleteUser.canExecute(user.userProps, otherUser.userProps.id);
        expect(canDelete).toEqual(false);
    });

    it("Should allow an admin to delete any account", async () => {
        const admin = await signUp.execute({
            firstName: "Admin",
            lastName: "Admin",
            email: "admin@doe.fr",
            password: "qwerty",
            role: Role.ADMIN
        });
        const otherUser = await signUp.execute({
            firstName: "Jane",
            lastName: "Doe",
            email: "jane2@doe.fr",
            password: "qwerty",
            role: Role.USER
        });
        const canDelete = await deleteUser.canExecute(admin.userProps, otherUser.userProps.id);
        expect(canDelete).toEqual(true);
        await deleteUser.execute(otherUser.userProps.id);
        const deletedUser = await userRepo.getById(otherUser.userProps.id);
        expect(deletedUser).toBeUndefined();
    });
});
