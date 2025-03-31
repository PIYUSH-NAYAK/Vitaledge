const {z} = require('zod');

const signupValid = z.object({
    name: z.string().min(3,{message: "Username must be atleast 3 characters"}).max(50,{message: " name must be under 50 character"}).trim(),
    email: z.string().email({message: "Please enter a valid email address"}).trim().refine(
        (email) =>
          email.endsWith("@gmail.com") || email.endsWith("@iiitl.ac.in"),
        {
          message: "Email must belong to @gmail.com or @iiitl.ac.in domains",
        }
      ),
    password: z.string().min(6,{message: "Password must be atleast 6 characters"}).max(50,{message: "Password must be under 50 characters"})
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string()

})

module.exports = signupValid; 