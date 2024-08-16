const mongoose = require('mongoose');
const Position = require("../models/positions");
const Hiring = require("../models/hirings");

const clientSchema = new mongoose.Schema({
    date: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: Number, required: true },
    contactName2: { type: String },
    contactEmail2: { type: String },
    contactPhone2: { type: Number }
}, { timestamps: true });

clientSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const clientId = this._id;
        await Position.deleteMany({ client: clientId });
        await Hiring.deleteMany({ client: clientId });
        next();
    } catch (error) {
        next(error);
    }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
