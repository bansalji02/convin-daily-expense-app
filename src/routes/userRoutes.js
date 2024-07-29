import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();


//These are the user routes which includes the following:
//1. Register a new user
//2. Login a user
//3. Get user details
router.post('/register', userController.createUser);
router.post('/login', userController.login);
router.get('/userDetails/:id', userController.getUserDetails);

export default router;