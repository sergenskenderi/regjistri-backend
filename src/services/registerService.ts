import Register, { IRegister } from '../models/Register';
import {FilterQuery} from "mongoose";

const RegisterService = {
    async createRegister(registerData: Partial<IRegister>) {
        try {
            const newRegister = new Register(registerData);
            return await newRegister.save();
        } catch (error) {
            if (error instanceof Error) {
                if ('code' in error && (error as any).code === 11000) {
                    const duplicateField = Object.keys((error as any).keyValue).join(', ');
                    throw new Error(`Ky person eshte i regjistruar ne sistem: ${duplicateField}`);
                }
                throw new Error(`Error creating register: ${error.message}`);
            }
            throw new Error('Unknown error occurred while creating register.');
        }
    },

    async getAllRegisters(filters: Partial<IRegister>, page: number = 1, limit: number = 20) {
        try {
            const validFilters: FilterQuery<IRegister> = Object.keys(filters).reduce((acc, key) => {
                if (key in Register.schema.paths) {
                    acc[key] = filters[key as keyof IRegister];
                }
                return acc;
            }, {} as FilterQuery<IRegister>);

            const skip = (page - 1) * limit;

            const registers = await Register.find(validFilters)
                .skip(skip)
                .limit(limit);

            const total = await Register.countDocuments(validFilters); // Total number of matching documents

            return {
                data: registers,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error fetching registers: ${error.message}`);
            }
            throw new Error('Unknown error occurred while fetching registers.');
        }
    },

    async countBySchool(njesia: number) {
        try {
            const result = await Register.aggregate([
                { $match: { njesia ,isDeleted: { $ne: true } } }, // Filter by njesia
                { $group: { _id: '$school', count: { $sum: 1 } } }, // Group by school and count
                { $project: { school: '$_id', count: 1, _id: 0 } } // Format the output
            ]);

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error counting data by school: ${error.message}`);
            }
            throw new Error('Unknown error occurred while counting data by school.');
        }
    },

    async countByQV(school: string) {
        try {
            const result = await Register.aggregate([
                { $match: { school, isDeleted: { $ne: true } } }, // Filter by school
                { $group: { _id: '$qv', count: { $sum: 1 } } }, // Group by qv and count
                { $project: { qv: '$_id', count: 1, _id: 0 } } // Format the output
            ]);

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error counting data by qv: ${error.message}`);
            }
            throw new Error('Unknown error occurred while counting data by qv.');
        }
    },

    async updateRegister(id: string, updateData: Partial<IRegister>) {
        try {
            const updatedRegister = await Register.findByIdAndUpdate(id, updateData, { new: true });
            return updatedRegister;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error updating register: ${error.message}`);
            }
            throw new Error('Unknown error occurred while updating register.');
        }
    },

    async softDeleteRegister(id: string) {
        try {
            const deletedRegister = await Register.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            return deletedRegister;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error soft deleting register: ${error.message}`);
            }
            throw new Error('Unknown error occurred while soft deleting register.');
        }
    },
};

export default RegisterService;
