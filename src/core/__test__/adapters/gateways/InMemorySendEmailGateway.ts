import {SendEmailGateway} from "../../../gateways/SendEmailGateway";
import {Msg} from "../../../domain/ValueObject/Msg";

export class InMemorySendEmailGateway implements SendEmailGateway {
    async send(msg: Msg): Promise<void> {
        console.log("send in inMemory for __test__");
    }
}