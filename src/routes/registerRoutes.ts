import {Router} from "express";
import RegisterController from "../controllers/registerController";

const router = Router();

router.post('/registers', RegisterController.createRegister); // Create a new register
router.get('/registers', RegisterController.getAllRegisters); // Get all registers with filters, pagination
router.get('/registers/count-by-school', async (req, res) => {
    try {
        await RegisterController.countBySchool(req, res);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.get('/registers/count-by-qv', async (req, res) => {
    try {
        await RegisterController.countByQV(req, res);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
router.put('/registers/:id', async (req, res) => {
    try {
        await RegisterController.updateRegister(req, res);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

router.delete('/registers/:id', async (req, res) => {
    try {
        await RegisterController.softDeleteRegister(req, res);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router;
