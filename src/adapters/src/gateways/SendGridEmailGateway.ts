import 'reflect-metadata';
import { SendEmailGateway } from "../../../core/gateways/SendEmailGateway";
import { Msg } from "../../../core/domain/ValueObject/Msg";
import sgMail from '@sendgrid/mail';
import {injectable} from "inversify";

@injectable()
export class SendGridEmailGateway implements SendEmailGateway {
    constructor(private apiKey: string) {
        sgMail.setApiKey(apiKey);
    }

    async send(msg: Msg): Promise<void> {
        const { to, from, subject, text, html } = msg;

        const mail = {
            to,
            from,
            subject,
            text,
            html,
        };

        try {
            await sgMail.send(mail);
        } catch (error) {

            if (error.response) {
            }
        }
    }
}
