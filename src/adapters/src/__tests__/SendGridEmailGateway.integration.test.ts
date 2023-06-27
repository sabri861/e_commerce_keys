import { SendGridEmailGateway } from "../gateways/SendGridEmailGateway";
import { Msg } from "../../../core/domain/ValueObject/Msg";
import sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn(),
}));

describe("SendGridEmailGateway mock test", () => {
    let sendGridEmailGateway: SendGridEmailGateway;
    let msg: Msg;

    beforeAll(() => {
        sendGridEmailGateway = new SendGridEmailGateway("MOCK_API_KEY");
    });

    beforeEach(() => {
        msg = {
            to: "test@example.com",
            from: "noreply@yourdomain.com",
            subject: "Test Subject",
            text: "Test Text",
            html: "<p>Test HTML</p>"
        };
    });

    it("should send an email", async () => {
        await sendGridEmailGateway.send(msg);
        expect(sgMail.send).toHaveBeenCalledWith(msg);
    });
});
