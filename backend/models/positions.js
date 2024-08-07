const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    position: { type: String, required: true },
    salary: { type: String },
    keyCriteria: { type: String },
    status: { type: String, default: "Open" },
    location: { type: String }
}, { timestamps: true });


const Position = mongoose.model('Position', positionSchema);
module.exports = Position;
