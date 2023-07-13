import { DomainError } from "./DomainError";

export namespace UserError {
    export class EmailValidationFaield extends DomainError{}
    export class PasswordValidationFailed extends DomainError{}
}