import {Role} from "../../domain/ValueObject/Role";
import {InMemoryUserRepo} from "../adapters/repositories/InMemoryUserRepo";
import {DeleteUser} from "../../usecase/user/DeleteUser";
import {SignUp} from "../../usecase/user/SignUp";
import {User} from "../../domain/entities/User";
import {InMemorySendEmailGateway} from "../adapters/gateways/InMemorySendEmailGateway";
import {InMemoryJwtGateway} from "../adapters/gateways/InMemoryJwtGateway.";
import {InMemoryPasswordGateway} from "../adapters/gateways/InMemoryPasswordGateway";
import {Identity} from "../../domain/Identity";


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

    it('should delete the user', async () => {
        await deleteUser.execute(user.userProps.id);
        const deletedUser = await userRepo.getById(user.userProps.id);
        expect(deletedUser).toBeUndefined();
    });

    it('should not throw an error when user does not exist', async () => {
        await expect(deleteUser.execute('nonexistentid')).resolves.not.toThrow();
    });

    it('should return false when role is less than ADMIN', async () => {
        const identity: Identity = {
            id: user.userProps.id,
            role: Role.USER
        };
        const canExecute = await deleteUser.canExecute(identity);
        expect(canExecute).toBe(false);
    });

    it('should return true when role is ADMIN', async () => {
        const identity: Identity = {
            id: user.userProps.id,
            role: Role.ADMIN
        };
        const canExecute = await deleteUser.canExecute(identity);
        expect(canExecute).toBe(true);
    });

});
