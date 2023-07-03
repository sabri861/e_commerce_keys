import 'reflect-metadata';
import {JwtIdentityGateway} from "../gateways/JwtIdentityGateway";
import {User} from "../../../core/domain/entities/User";
import {v4} from "uuid";
import {Role} from "../../../core/domain/ValueObject/Role";

const secretKey = "YOUR_SECRET_KEY_FOR_TESTING";

describe("JwtIdentityGateway integration test", () => {
    let jwtIdentityGateway: JwtIdentityGateway;
    let testUser: User;
    let token: string;
    let emailConfirmationToken: string;

    beforeAll(() => {
        jwtIdentityGateway = new JwtIdentityGateway(secretKey);

        testUser = User.create({
            email: `${v4()}@example.com`,
            password: "testPassword",
            role: Role.USER

        });

        console.log('Created test user with ID: ', testUser.userProps.id);
    });

    it("should generate a JWT", async () => {
        token = await jwtIdentityGateway.generate(testUser);
        expect(typeof token).toEqual("string");
    });

    it("should correctly decode JWT", async () => {
        const decoded = await jwtIdentityGateway.decoded(token);

        expect(decoded.id).toBe(testUser.userProps.id);
        expect(decoded.role).toBe(testUser.userProps.role);
    });

    it("should generate an email confirmation JWT", async () => {
        emailConfirmationToken = await jwtIdentityGateway.generateEmailConfirmationToken(testUser);
        expect(typeof emailConfirmationToken).toEqual("string");
    });

    it("should correctly decode email confirmation JWT", async () => {
        const decoded = await jwtIdentityGateway.decoded(emailConfirmationToken);


        expect(decoded.id).toBe(testUser.userProps.id);
        expect(decoded.role).toBe(testUser.userProps.role);
    });
});
