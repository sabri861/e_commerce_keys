import 'reflect-metadata';
import 'dotenv/config';
import express from "express";
import { configureExpress } from './app/src/config/express';
import mongoose from 'mongoose';

const PORT = 3000;

export const app = express()

configureExpress(app)

mongoose.connect('mongodb://127.0.0.1:27017/KEYS')

app.listen(PORT, () => {
    console.info(`Starting server on http://localhost:${PORT}`);
})
