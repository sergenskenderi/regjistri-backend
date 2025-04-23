import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import registerRoutes from "./routes/registerRoutes";
import { Strategy as LocalStrategy } from 'passport-local';
import UserService from './services/UserService';
import connectDB from "./database";
import mongoose from "mongoose";
import { IUser } from "./models/User";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"], // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret", // Use a secure secret
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy({ usernameField: 'email' }, UserService.authenticateUser)
);

passport.serializeUser((user, done) => {
    UserService.serializeUser(user as unknown as mongoose.Document & IUser, done);
});

passport.deserializeUser((id: unknown, done) => {
    UserService.deserializeUser(id as string, done);
});


app.use("/api/auth", authRoutes);
app.use("/api/", registerRoutes);

export default app;
