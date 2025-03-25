import { Router } from 'express';
import clientInfoParser from '../../middlewares/clientInfoParser';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/login', clientInfoParser, AuthController.loginUser);
export const AuthRoutes = router;
