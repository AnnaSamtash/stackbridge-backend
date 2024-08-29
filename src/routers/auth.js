import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema } from '../validation/auth.js';
import { loginUser, logout, registerUser } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { checkToken } from '../middlewares/checkToken.js';

const router = Router();

router.post(
  '/signup',
  validateBody(createUserSchema),
  ctrlWrapper(registerUser),
);

router.post('/signin', validateBody(createUserSchema), ctrlWrapper(loginUser));

router.post('/logout', checkToken, ctrlWrapper(logout));

export default router;
