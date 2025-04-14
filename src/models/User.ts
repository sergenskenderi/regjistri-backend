import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    googleId?: string;
    facebookId?: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  },
    password: { type: String },
    name: { type: String, required: true },
    googleId: { type: String },
    facebookId: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);