const jwt = require('jsonwebtoken');
const userTable = require('../models/user');

const userAuth = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_KEY);
        req.user = await userTable.findById(decodedData.id);
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};

module.exports = userAuth;
