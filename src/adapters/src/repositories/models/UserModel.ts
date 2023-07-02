import * as mongoose from "mongoose";

const userShema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        enum: [1, 2, 3],
        required: true,
    },
});

export const UserModel = mongoose.model("user", userShema);