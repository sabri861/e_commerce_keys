import { model, Schema } from "mongoose";
import {Role} from "../../../../core/domain/ValueObject/Role";

export type  userModel = {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    role: Role;
}

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [Role.USER, Role.SELLER, Role.ADMIN],
        required: true
    },
}, { timestamps: true });

export const UserModel = model('User', UserSchema);
