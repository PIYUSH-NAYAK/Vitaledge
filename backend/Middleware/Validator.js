const { schema } = require('../Models/User-Model');

const valid =(schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();

    } catch (err) {
        const message = err.errors[0].message;
        console.log(message);

        return res.status(400).json({ message });
    }

}
module.exports = valid;