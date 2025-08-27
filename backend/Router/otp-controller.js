const OTP = require('../Models/OTP');
const { generateOTP, sendOTPEmail } = require('../Utils/emailService');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

// Send OTP for email verification
const sendOTP = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, name, and password are required'
            });
        }

        // Check if user already exists in Firebase
        try {
            const existingUser = await admin.auth().getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already registered with this email. Please login instead.',
                    errorCode: 'user-already-exists'
                });
            }
        } catch (error) {
            // User doesn't exist, which is what we want for registration
            if (error.code !== 'auth/user-not-found') {
                console.error('Error checking user existence:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error checking user existence'
                });
            }
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Hash password for storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email });

        // Save OTP to database
        const otpRecord = new OTP({
            email,
            name,
            password: hashedPassword,
            otp
        });

        await otpRecord.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, name);

        if (emailResult.success) {
            res.status(200).json({
                success: true,
                message: 'OTP sent successfully to your email',
                email: email
            });
        } else {
            // Delete OTP record if email failed
            await OTP.deleteOne({ email });
            res.status(500).json({
                success: false,
                message: 'Failed to send OTP email',
                error: emailResult.error
            });
        }

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Verify OTP and complete registration
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ 
            email: email.toLowerCase(),
            verified: false
        }).sort({ createdAt: -1 }); // Get the latest OTP

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'No valid OTP found. Please request a new one.'
            });
        }

        // Check attempts
        if (otpRecord.attempts >= 3) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                success: false,
                message: 'Too many failed attempts. Please request a new OTP.'
            });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            // Increment attempts
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining.`
            });
        }

        // OTP is valid - mark as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Return user data for Firebase registration
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            userData: {
                email: otpRecord.email,
                name: otpRecord.name,
                verified: true
            }
        });

        // Clean up verified OTP after successful verification
        setTimeout(async () => {
            await OTP.deleteOne({ _id: otpRecord._id });
        }, 5000); // Delete after 5 seconds

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find existing OTP record
        const existingRecord = await OTP.findOne({ 
            email: email.toLowerCase(),
            verified: false
        }).sort({ createdAt: -1 });

        if (!existingRecord) {
            return res.status(400).json({
                success: false,
                message: 'No registration found. Please start registration again.'
            });
        }

        // Generate new OTP
        const newOTP = generateOTP();

        // Update existing record
        existingRecord.otp = newOTP;
        existingRecord.attempts = 0;
        existingRecord.createdAt = new Date();
        await existingRecord.save();

        // Send new OTP email
        const emailResult = await sendOTPEmail(email, newOTP, existingRecord.name);

        if (emailResult.success) {
            res.status(200).json({
                success: true,
                message: 'New OTP sent successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send OTP email',
                error: emailResult.error
            });
        }

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP
};
