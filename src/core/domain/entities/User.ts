import {v4} from "uuid";
import {Role} from "../ValueObject/Role";


interface UserProps {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    role : Role;

}

export class User {
    userProps: UserProps;
    constructor(userProps: UserProps) {
        this.userProps = userProps;
    }

    static create(props:{
        firstName?: string;
        lastName?: string;
        email: string,
        password: string
        role: Role,
    })
    {
        return new User ({
            ...props,
            id: v4(),
        })
    }

    update(props: {email?: string, password?: string}) {
        if (props.email) {
            this.userProps.email = props.email;
        }
        if (props.password) {
            this.userProps.password = props.password;
        }
    }
}




