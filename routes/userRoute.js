import express from 'express'
import { deleteUser, getAllUsers, getSingleUser, loginUser, registerUser, updateUser, verifyOtp } from "../controllers/userController.js";
import { upload } from '../middleware/multer.js';

const router = express.Router()

//user Register route
router.post('/register', upload.single("profileImage"),  registerUser);

// OTP verification Route
router.post('/verifyOtp', verifyOtp);

//Login Route
router.post('/login', loginUser)

// Get All Users
router.get('/get-all-users', getAllUsers); 

// Get Single User
router.get('/get-single-user/:id', getSingleUser); 

// Delete User
router.delete('/delete-user/:id', deleteUser); 

// Update User
router.put('/update-user/:id', updateUser); 

export default router