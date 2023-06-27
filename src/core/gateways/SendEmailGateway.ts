import {Msg} from "../domain/ValueObject/Msg";

export interface SendEmailGateway {
    send(msg: Msg): Promise<void>;
}