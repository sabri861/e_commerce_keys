export class KeysIdentifiers {
    static readonly userRepo = Symbol.for('userRepo')
    static readonly passwordGateway = Symbol.for('passwordGateway')
    static readonly sendEmailGateway = Symbol.for('sendEmailGateway')
    static readonly tokenGateway = Symbol.for('tokenGateway')
}