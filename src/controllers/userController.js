import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';

import { validateUser } from '../utils/validation.js';



// Create a new user. Demo request body is:
// {
//   "name": "naitik Bansal",
//   "email": "bansal.naitik@gmail.com",
//   "mobileNumber": "8798108933",
//   "password": "bansal123"
// }
export const createUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, mobileNumber, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};


//Function to login a user. Demo request body is:
// {
//   "email": "bansal.naitik@gmail.com",
//   "password": "bansal123"
// }
export const login= async(req, res) =>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id, fullName: user.name }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
}


//Function to get user details. Demo request is empty.
// GET /user/:id
// Here, :id is the id of the user whose details you want to get.
// For example, GET /user/60c4a4b6b4b3e30015f1f2d7

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user details', error: error.message });
  }
};