const {z} = require('zod');

const loginValid = z.object({
    email : z.string().email({message: "Invalid email"}).trim().refine(
        (email) =>
          email.endsWith("@gmail.com") || email.endsWith("@iiitl.ac.in"),
        {
          message: "Email must belong to @gmail.com or @iiitl.ac.in domains",
        }
      ),
    password: z.string()
});

module.exports = loginValid;