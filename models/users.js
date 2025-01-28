import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true, 
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      }
    },
    otp: {
      type: Number,
    },
    otpExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

//decrypt function
UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

UserSchema.methods.tokenGenerate = function () {
  return Jwt.sign({ _id: this._id }, process.env.JWT_KEY, { expiresIn: "7d" });
};

export const userModel = mongoose.model("Users", UserSchema);
