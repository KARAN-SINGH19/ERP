const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    mainFunction: { type: String },
    subFunction: { type: String },
    candidateName: { type: String },
    dob: { type: String },
    nationality: { type: String },
    company: { type: String },
    location: { type: String },
    currentDesignation: { type: String },
    yearsOfExperience: { type: String },
    currentSalary: { type: String },
    noticePeriod: { type: String },
    education: { type: String },
    comments: { type: String },
    status: [{
        hiring: { type: mongoose.Schema.Types.ObjectId, ref: 'Hiring' }
    }],
    resume: {
        fileId: mongoose.Schema.Types.ObjectId,
        filename: String
    },
    recruiter: { type: String }
}, { timestamps: true });

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;


