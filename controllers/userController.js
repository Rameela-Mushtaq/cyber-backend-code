import { userModel } from "../models/users.js"
import nodemailer from 'nodemailer'
import { setOtpAndExpiry } from "../utils/setotp.js";
import { imageOnCloudinary } from "../utils/cloudinary.js";


// Sent Mail
const verifyMail = async (email, otp) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "OTP Verification",
            html: `<div>
                <p>Your OTP is here: <strong>${otp}</strong></p>
                <p>This OTP will expire in 30 minutes.</p>
            </div>`,
        });

        console.log("Mail Sent Successfully");
    } catch (error) {
        console.log(error, "Failed to send email");
    }
};


// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if the email already exists
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res.status(401).send({
          success: false,
          message: "User already exists",
        });
      }
  
      // Upload profile image to Cloudinary if file is provided
      let profileImage = {};
      if (req.file) {
        const fileBuffer = req.file.buffer; // Use buffer from multer
        const fileName = req.file.originalname.split('.')[0]; // Optional: Use original file name without extension
        const { secure_url, public_id } = await imageOnCloudinary(fileBuffer, "users", fileName);
  
        if (!secure_url) {
          return res.status(400).send({
            success: false,
            message: "Error while uploading image",
            error: secure_url,
          });
        }
  
        profileImage = {
          secure_url,
          public_id,
        };
      }
  
      // Create a new user
      const user = await userModel.create({
        name: name,
        email: email,
        password: password,
        profileImage,
        isVerified: false,
      });
  
      // Set OTP and send verification email
      await setOtpAndExpiry(user);
      await verifyMail(email, user.otp);
  
      res.status(201).send({
        success: true,
        message: "OTP sent to your email. Please verify to complete registration.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Register API",
        error,
      });
    }
  };
  

// Otp verification
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        if (user.otp !== parseInt(otp) || user.otpExpiry < Date.now()) {
            return res.status(400).send({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // Handle registration verification
        if (!user.isVerified) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();

            const token = user.tokenGenerate();

            return res.status(200).send({
                success: true,
                message: "User verified and registration complete!",
                token,
                user
            });
        }

        // Handle login OTP verification
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = user.tokenGenerate();

        return res.status(200).send({
            success: true,
            message: "Login successful!",
            token,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in OTP verification",
            error,
        });
    }
};

//Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            });
        }

        const validPass = await user.comparePassword(password);
        if (!validPass) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        // Set OTP and expiration using the utility function
        await setOtpAndExpiry(user);

        await verifyMail(user.email, user.otp);

        res.status(200).send({
            success: true,
            message: 'OTP sent to your email. Please verify to complete login.',
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Login API Error',
            error
        });
    }
};

// Get Single User
export const getSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by ID
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'User fetched successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Single User API',
            error
        });
    }
};

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find(); // Fetch all users

        if (users.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No users found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Users fetched successfully',
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Users API',
            error
        });
    }
};

// Update User
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {

        // Find the user by ID
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        // Update the user's details
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // Ensure hashing if necessary (handled in the schema pre-save hook)

        const updatedUser = await user.save(); // Save changes to the database

        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update User API',
            error
        });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the user
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'User deleted successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete User API',
            error
        });
    }
};



