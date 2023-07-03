import 'reflect-metadata';
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
            pseudo: "jhon86",
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

    it("Should update a user's pseudo", async () => {
        const updatedUser = await updateUser.execute({
            id: user.userProps.id,
            pseudo: "jhon86",
        });

        expect(updatedUser.userProps.pseudo).toEqual("jhon86");
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
    it("Should throw an error if user not found", async () => {
        await expect(updateUser.execute({
            id: "non-existing-id",
            email: "jane@doe.fr"
        })).rejects.toThrow("User not found");
    });

    it("Should allow an admin to execute", async () => {
        const adminUser = await signUp.execute({
            firstName: "Jane",
            lastName: "Admin",
            email: "janeAdmin@doe.fr",
            password: "azerty",
            role: Role.ADMIN
        });

        const canExecute = await updateUser.canExecute({
            id: adminUser.userProps.id,
            role: Role.ADMIN
        });

        expect(canExecute).toEqual(true);
    });


    it("Should not allow a user to execute", async () => {
        const canExecute = await updateUser.canExecute({
            id: user.userProps.id,
            role: Role.USER
        });

        expect(canExecute).toEqual(false);
    });


});
