const mongoose = require('mongoose');

const hiringSchema = new mongoose.Schema({
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    remarks: { type: String },
    comment: { type: String }
}, { timestamps: true });


hiringSchema.pre('deleteOne', async function (next) {
    try {
        const hiring = this;
        const Candidate = mongoose.model('Candidate');
        const candidates = await Candidate.find({ 'status.hiring': hiring._id });
        for (let candidate of candidates) {
            candidate.status = candidate.status.filter(s => !s.hiring.equals(hiring._id));
            await candidate.save();
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Hiring = mongoose.model('Hiring', hiringSchema);
module.exports = Hiring;
