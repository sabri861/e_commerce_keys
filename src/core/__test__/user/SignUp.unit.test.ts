import {InMemoryUserRepo} from "../adapters/repositories/InMemoryUserRepo";
import {SignUp} from "../../usecase/user/SignUp";
import {InMemoryPasswordGateway} from "../adapters/gateways/InMemoryPasswordGateway";
import {InMemorySendEmailGateway} from "../adapters/gateways/InMemorySendEmailGateway";
import {InMemoryJwtGateway} from "../adapters/gateways/InMemoryJwtGateway.";
import {Role} from "../../domain/ValueObject/Role";


describe("Unit-SignUp", () => {
    let userRepo: InMemoryUserRepo;
    let signUp: SignUp;
    let passwordGateway: InMemoryPasswordGateway;
    let sendEmailGateway: InMemorySendEmailGateway;
    let tokenGateway: InMemoryJwtGateway;
    let sendSpy: jest.SpyInstance;

    beforeAll(() => {
        userRepo = new InMemoryUserRepo();
        passwordGateway = new InMemoryPasswordGateway();
        sendEmailGateway = new InMemorySendEmailGateway();
        tokenGateway = new InMemoryJwtGateway();
        signUp = new SignUp(userRepo, passwordGateway,sendEmailGateway, tokenGateway);

    })

    beforeEach(() => {
        sendSpy = jest.spyOn(sendEmailGateway, 'send');
    })



    it("Should create a user", async () => {
        const user = await signUp.execute({
            firstName: "jhon",
            lastName: "doe",
            email : "john@doe.fr",
            password : "azerty",
            role: Role.USER,
        })

        const expectedMsg = {
            to: "john@doe.fr",
            from: 'marwanecompany@gmail.com',
            subject: 'Welcome to our website ',
            text: `Please confirm your email by clicking the following link:`,
            html: `<p>Please confirm your email by clicking the following link: <a href='https://yourwebsite.com/confirm/${tokenGateway.generateEmailConfirmationToken(user)}'>Confirm Email</a></p>`
        };

        expect(sendEmailGateway.send).toHaveBeenCalledWith(expectedMsg);
        expect(user.userProps.email).toEqual("john@doe.fr");
        expect(user.userProps.role).toEqual(Role.USER);
    });

    it("Should not create a user if email already exists", async () => {

        const user = {
            firstName: "jhon",
            lastName: "doe",
            email: "john2@doe.fr",
            password: "azerty",
            role: Role.USER
        };


        await signUp.execute(user);
        await expect(signUp.execute(user)).rejects.toThrow("User already exists");

    });


})
