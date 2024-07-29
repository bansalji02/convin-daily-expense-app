import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.get('/userDetails/:id', userController.getUserDetails);

export default router;