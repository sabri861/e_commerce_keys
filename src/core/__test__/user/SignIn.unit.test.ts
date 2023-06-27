import {InMemoryUserRepo} from "../adapters/repositories/InMemoryUserRepo";
import {SignIn} from "../../usecase/user/SignIn";
import {InMemoryPasswordGateway} from "../adapters/gateways/InMemoryPasswordGateway";
import {User} from "../../domain/entities/User";
import {Role} from "../../domain/ValueObject/Role";



describe("Unit-SignIn", () => {
    let userRepo: InMemoryUserRepo;
    let signIn: SignIn;
    let passwordGateway: InMemoryPasswordGateway;

    beforeEach(() => {
        userRepo = new InMemoryUserRepo();
        passwordGateway = new InMemoryPasswordGateway();
        signIn = new SignIn(userRepo, passwordGateway );

    })

    it("Should sign in a user", async () => {
        const user = await User.create({
            firstName: "jhon",
            lastName: "doe",
            email : "john@doe.fr",
            password : "azerty",
            role: Role.USER
        })
        await userRepo.save(user);

        const signedInUser = await signIn.execute({

            email : "john@doe.fr",
            password : "azerty",
        })

        expect(signedInUser.userProps.email).toEqual("john@doe.fr");
    });

    it("Should not sign in a user if the email does not exist", async () => {
        const signInProps = {
            email: "john2@doe.fr",
            password: "azerty",
        };

        await expect(signIn.execute(signInProps)).rejects.toThrow("User does not exist");
    });

    it("Should not sign in a user if the password is incorrect", async () => {
        const user = await User.create({
            firstName: "jhon",
            lastName: "doe",
            email : "john@doe.fr",
            password : "azerty",
            role: Role.USER
        })
        await userRepo.save(user);

        const signInProps = {
            email: "john@doe.fr",
            password: "wrongPassword",
        };

        await expect(signIn.execute(signInProps)).rejects.toThrow("Invalid password");
    });

})
