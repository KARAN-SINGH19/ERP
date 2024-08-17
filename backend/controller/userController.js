const userTable = require("../models/user");
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    try {
        const data = req.body
        const user = await userTable.create(data)
        if (user) {
            res.status(200).json({ success: true, message: 'user added successfully!!' });
        } else {
            res.status(400).json({ success: true, message: 'user not added!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}


exports.getUsers = async (req, res) => {
    try {
        const user = await userTable.find()
        if (user) {
            res.status(200).json({ success: true, message: 'users fetched successfully!!', user: user });
        } else {
            res.status(400).json({ success: true, message: 'user not fetched!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}


exports.getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userTable.findById(id)
        if (user) {
            res.status(200).json({ success: true, message: 'users fetched successfully!!', user: user });
        } else {
            res.status(400).json({ success: true, message: 'user not fetched!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.getUserNames = async (req, res) => {
    try {
        const users = await userTable.find({}, 'name');
        if (users) {
            res.status(200).json({ success: true, message: 'Users fetched successfully!!', user: users });
        } else {
            res.status(400).json({ success: false, message: 'Users not fetched!!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error!!' });
    }
}


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        } else {
            delete data.password;
        }

        const user = await userTable.findByIdAndUpdate(id, data, { new: true });

        if (user) {
            res.status(200).json({ success: true, message: 'User data updated successfully!', user: user });
        } else {
            res.status(400).json({ success: false, message: 'User not updated!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userTable.findById(id);

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found!' });
        }

        await user.remove();

        res.status(200).json({ success: true, message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error!' });
    }
}


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await userTable.findOne({ email: email })

        console.log(user)

        if (user) {
            res.status(200).json({ success: true, message: 'user validated successfully!!' });
        } else {
            res.status(400).json({ success: true, message: 'Invalid Credentials!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.countUsers = async (req, res) => {
    try {
        const count = await userTable.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.userRole = async (req, res) => {
    try {
        const { id, role } = req.user
        console.log(role)
        const user = await userTable.findById(id)
        res.status(200).json({ role });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


