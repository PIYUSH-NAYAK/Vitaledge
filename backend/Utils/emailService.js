const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name = 'User') => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'VitalEdge - Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6366f1; margin: 0; font-size: 28px;">VitalEdge</h1>
                        <p style="color: #666; margin: 5px 0 0 0;">Medical Platform</p>
                    </div>
                    
                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Email Verification</h2>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.5;">
                        Hello ${name},
                    </p>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.5;">
                        Thank you for registering with VitalEdge! Please verify your email address by entering the following OTP:
                    </p>
                    
                    <div style="background-color: #f8f9fa; border: 2px dashed #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                        <h1 style="color: #6366f1; font-size: 32px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.5;">
                        This OTP is valid for <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
                    </p>
                    
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                            <strong>Security Note:</strong> Never share this OTP with anyone. VitalEdge will never ask for your OTP via phone or email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            © 2025 VitalEdge. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateOTP,
    sendOTPEmail
};
