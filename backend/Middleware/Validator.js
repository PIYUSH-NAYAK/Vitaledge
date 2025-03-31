const { schema } = require('../Models/User-Model');

const valid = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {
        // Get all validation errors
        const errors = err.errors;
        let priorityMessage = "";
        
        // Check for email errors first
        const emailError = errors.find(e => e.path.includes('email'));
        if (emailError) {
            priorityMessage = emailError.message;
        } 
        // Then check for password errors
        else if (!priorityMessage) {
            const passwordError = errors.find(e => e.path.includes('password'));
            if (passwordError) {
                priorityMessage = passwordError.message;
            }
        }
        // Then check for confirmPassword errors
        else if (!priorityMessage) {
            const confirmPasswordError = errors.find(e => e.path.includes('confirmPassword'));
            if (confirmPasswordError) {
                priorityMessage = confirmPasswordError.message;
            }
        }
        // Finally, check for name errors
        else if (!priorityMessage) {
            const nameError = errors.find(e => e.path.includes('name'));
            if (nameError) {
                priorityMessage = nameError.message;
            }
        }
        
        // If no priority message was found, use the first error
        if (!priorityMessage && errors.length > 0) {
            priorityMessage = errors[0].message;
        }
        
        console.log(priorityMessage);
        return res.status(400).json({ message: priorityMessage });
    }
};
module.exports = valid;