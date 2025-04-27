import Register, { IRegister } from '../models/Register';
import {FilterQuery} from "mongoose";

const RegisterService = {
    async createRegister(registerData: Partial<IRegister>) {
        try {
            if (registerData.numerPersonal) {
                // Check if a register with this numerPersonal already exists
                const existingRegister = await Register.findOne({
                    numerPersonal: registerData.numerPersonal,
                    isDeleted: { $ne: true } // Exclude soft-deleted records
                });

                if (existingRegister) {
                    throw new Error(`Ky person eshte i regjistruar ne sistem: numerPersonal`);
                }
            }
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
            // Initialize base filter to exclude soft-deleted items
            const baseFilter = { isDeleted: { $ne: true } };

            // Add user filters
            const validFilters = Object.keys(filters).reduce<FilterQuery<IRegister>>((acc, key) => {
                if (key in Register.schema.paths && filters[key as keyof IRegister] !== undefined) {
                    const value = filters[key as keyof IRegister];
                    if (typeof value === 'string' && value.trim() !== '') {
                        acc = { ...acc, [key]: { $regex: value, $options: 'i' } };
                    } else if (value !== null && value !== '') {
                        acc = { ...acc, [key]: value };
                    }
                }
                return acc;
            }, baseFilter);

            const skip = (page - 1) * limit;

            const registers = await Register.find(validFilters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const normalizedRegisters = registers.map(register => ({
                _id: register._id,
                emer: register.emer || '',
                atesi: register.atesi || '',
                mbiemer: register.mbiemer || '',
                numerPersonal: register.numerPersonal || '',
                datelindja: register.datelindja || null,
                celular: register.celular || '',
                referuar: register.referuar || '',
                qarku: register.qarku || '',
                njesia: register.njesia || 0,
                qv: register.qv || '',
                school: register.school || '',
                imazh: register.imazh || '',
                isDeleted: register.isDeleted || false,
                __v: register.__v || 0
            }));

            const total = await Register.countDocuments(validFilters);

            return {
                data: normalizedRegisters,
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
            // Check if numerPersonal is being updated
            if (updateData.numerPersonal) {
                // Find any existing register with this numerPersonal that isn't the current record
                const existingRegister = await Register.findOne({
                    numerPersonal: updateData.numerPersonal,
                    _id: { $ne: id },
                    isDeleted: { $ne: true }
                });

                if (existingRegister) {
                    throw new Error(`Ky person eshte i regjistruar ne sistem: numerPersonal`);
                }
            }

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
