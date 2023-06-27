import {InMemoryUserRepo} from "../adapters/repositories/InMemoryUserRepo";
import {SignUp} from "../../usecase/user/SignUp";
import {GetUserById} from "../../usecase/user/GetUserById";
import {User} from "../../domain/entities/User";
import {InMemoryPasswordGateway} from "../adapters/gateways/InMemoryPasswordGateway";
import {Role} from "../../domain/ValueObject/Role";

describe("Unit-GetUserById", () => {
    let userRepo: InMemoryUserRepo;
    let signUp: SignUp;
    let getUserById: GetUserById;
    let passwordGateway: InMemoryPasswordGateway;
    let sendEmailGateway;
    let tokenGateway;

    beforeEach(() => {
        userRepo = new InMemoryUserRepo();
        signUp = new SignUp(userRepo, passwordGateway,sendEmailGateway, tokenGateway);
        passwordGateway = new InMemoryPasswordGateway();
        getUserById = new GetUserById(userRepo);
    });

    it("Should return a user by ID", async () => {

        const user = await User.create({
            firstName: "jhon",
            lastName: "doe",
            email : "john@doe.fr",
            password : "azerty",
            role: Role.USER,
        })
        await userRepo.save(user);
        const userId = user.userProps.id;

        const userCheck = await getUserById.execute({
            userId
        });

        expect(userCheck.userProps.id).toEqual(userId);
    });
});
