const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const jwtToken = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password should have atleat 8 characters"]
    },
    role: {
        type: String,
        default: "user"
    }
})


userSchema.pre("save", async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.getJWTToken = function () {
    const token = jwtToken.sign({ id: this.id, name: this.name, email: this.email, role: this.role }, process.env.JWT_KEY, {
        expiresIn: 86500000
    })
    return token
}

userSchema.pre('remove', async function (next) {
    try {
        await mongoose.model('Position').updateMany(
            { recruiter: this._id },
            { $unset: { recruiter: '' } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const userTable = mongoose.model("users", userSchema)
module.exports = userTable