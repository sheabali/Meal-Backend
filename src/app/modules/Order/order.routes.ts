import { Router } from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../User/user.interface';
import { OrderController } from './order.controller';

const router = Router();

router.post('/', auth(UserRole.CUSTOMER), OrderController.createOrder);
