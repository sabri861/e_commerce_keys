import { BcryptPasswordGateway } from "../gateways/BcryptPasswordGateway";

describe("BcryptPasswordGateway integration test", () => {
    let bcryptPasswordGateway: BcryptPasswordGateway;
    let password: string;
    let hashedPassword: string;

    beforeAll(() => {
        bcryptPasswordGateway = new BcryptPasswordGateway();
    });

    beforeEach(() => {
        password = "testPassword";
    });

    it("should correctly encrypt a password", async () => {
        hashedPassword = await bcryptPasswordGateway.encrypt(password);
        expect(hashedPassword).not.toEqual(password);
    });

    it("should return true when comparing a password and its correct hash", async () => {
        const match = await bcryptPasswordGateway.compare(password, hashedPassword);
        expect(match).toBeTruthy();
    });

    it("should return false when comparing a password and an incorrect hash", async () => {
        const match = await bcryptPasswordGateway.compare("incorrectPassword", hashedPassword);
        expect(match).toBeFalsy();
    });
});
