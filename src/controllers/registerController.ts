import { Request, Response } from 'express';
import RegisterService from '../services/registerService';

const RegisterController = {
    async createRegister(req: Request, res: Response) {
        try {
            const register = await RegisterService.createRegister(req.body);
            res.status(201).json(register);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    async getAllRegisters(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await RegisterService.getAllRegisters(
                {...filters, isDeleted: false || undefined},
                parseInt(page as string, 10),
                parseInt(limit as string, 10)
            );
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    async countBySchool(req: Request, res: Response) {
        try {
            const { njesia } = req.query;
            if (!njesia) {
                return res.status(400).json({ error: 'njesia is required' });
            }
            const result = await RegisterService.countBySchool(parseInt(njesia as string, 10));
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    async countByQV(req: Request, res: Response) {
        try {
            const { school } = req.query;
            if (!school || typeof school !== 'string') {
                return res.status(400).json({ error: 'School must be a string and is required' });
            }
            const result = await RegisterService.countByQV(school);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    async updateRegister(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedRegister = await RegisterService.updateRegister(id, updateData);
            if (!updatedRegister) {
                return res.status(404).json({ error: 'Register not found' });
            }
            res.status(200).json(updatedRegister);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    async softDeleteRegister(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedRegister = await RegisterService.softDeleteRegister(id);
            if (!deletedRegister) {
                return res.status(404).json({ error: 'Register not found' });
            }
            res.status(200).json({ message: 'Register soft deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};

export default RegisterController;
