import { Router } from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import waterNoteRouter from './waterNote.js';
import waterRateRouter from './waterRate.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/waterRate', waterRateRouter);
router.use('/waterNotes', waterNoteRouter);

export default router;
