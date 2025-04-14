import mongoose, { Schema, Document } from 'mongoose';

export interface IRegister extends Document {
    emer: string;
    atesi: string;
    mbiemer: string;
    numerPersonal: string;
    datelindja: Date;
    celular: string;
    referuar: string;
    qarku: string;
    njesia: number;
    qv: string;
    school: string;
    imazh: string;
    isDeleted?: boolean;
}

const RegisterSchema: Schema = new Schema({
   emer: { type: String, required: true },
    atesi: { type: String, required: true },
    mbiemer: { type: String, required: true },
    numerPersonal: { type: String, required: true, unique: true },
    datelindja: { type: Date, required: true },
    celular: { type: String },
    referuar: { type: String },
    qarku: { type: String, required: true },
    njesia: { type: Number, required: true },
    qv: { type: String, required: true },
    school: { type: String, required: true },
    imazh: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Compound unique index for emer, atesi, and mbiemer
RegisterSchema.index(
    { emer: 1, atesi: 1, mbiemer: 1 },
    { unique: true, partialFilterExpression: { isDeleted: { $eq: false } } }
);

export default mongoose.model<IRegister>('Register', RegisterSchema);
