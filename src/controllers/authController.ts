import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import passport from "passport";
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const AuthController = {
    login(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', {session: false}, (err: any, user: IUser | false) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({message: 'Invalid credentials'});

            const payload: { id: string; email: string } = {id: user.id, email: user.email || ''};
            const token: string = jwt.sign(payload, JWT_SECRET, {expiresIn: '5h'});

            return res.json({
                message: 'Logged in successfully', token, user: {
                    id: user._id,
                    username: user.name,
                    email: user.email,
                },
            });
        })(req, res, next);
    }
}

export default AuthController;
