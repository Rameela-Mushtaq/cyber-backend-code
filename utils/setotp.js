
export const setOtpAndExpiry = (user) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    const otpExpiry = Date.now() + 30 * 60 * 1000; // OTP expiration time (30 minutes)

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    // Save the updated user with the OTP and expiry time
    return user.save();
};