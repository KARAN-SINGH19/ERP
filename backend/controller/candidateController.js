const Candidate = require("../models/candidates");
const userTable = require("../models/user")
const { GridFsStorage } = require('multer-gridfs-storage');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const multer = require("multer");
const dotenv = require('dotenv');

dotenv.config({ path: '../backend/config.env' });

const url = 'mongodb://localhost:27017/ERP';
const dbName = 'ERP';

let bucket;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(dbName);
    bucket = new GridFSBucket(db, { bucketName: 'candidates' });
    console.log('MongoDB connected successfully');
  })
  .catch(err => console.error('MongoDB connection error:', err));

const storage = new GridFsStorage({
  url,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => ({
    bucketName: 'candidates',
    filename: `${Date.now()}-${file.originalname}`
  })
});

const upload = multer({ storage });

exports.uploadCandidateResume = upload.single("resume");

exports.addCandidate = async (req, res) => {
  try {
    const { id, name } = req.user
    const {
      mainFunction,
      subFunction,
      position,
      candidateName,
      dob,
      nationality,
      company,
      location,
      currentDesignation,
      yearsOfExperience,
      currentSalary,
      noticePeriod,
      education,
      comments,
      client,
      positionName,
      remarks,
      selectedUser
    } = req.body;

    const candidateData = {
      mainFunction,
      subFunction,
      position,
      candidateName,
      dob,
      nationality,
      company,
      location,
      currentDesignation,
      yearsOfExperience,
      currentSalary,
      noticePeriod,
      education,
      comments,
      client,
      positionName,
      remarks,
      recruiter: selectedUser
    };

    if (req.file) {
      candidateData.resume = {
        fileId: req.file.id,
        filename: req.file.filename
      };
    }

    const candidate = new Candidate(candidateData);
    await candidate.save();

    res.status(200).json({ success: true, message: 'Candidate added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate({
        path: 'status.hiring',
        populate: [
          { path: 'client', model: 'Client' },
          { path: 'position', model: 'Position' }
        ]
      }).sort({ createdAt: -1 })
    console.log(candidates);
    res.status(200).json({ success: true, message: 'Candidates fetched successfully!', candidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.fileId);
    console.log(`Fetching file with ID: ${fileId}`);

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      console.log('No file found with the provided ID');
      return res.status(404).json({ error: 'No file found' });
    }

    const file = files[0];
    console.log('File found:', file);

    res.set('Content-Type', file.contentType);
    //res.set('Content-Disposition', `attachment; filename="${file.filename}"`); // download code
    res.set('Content-Disposition', `inline; filename="${file.filename}"`);

    const downloadStream = bucket.openDownloadStream(file._id);
    downloadStream.pipe(res);

  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (candidate) {
      await candidate.deleteOne();
      res.status(200).json({ success: true, message: 'Candidate deleted successfully!' });
    } else {
      res.status(404).json({ success: false, message: 'Candidate not found!' });
    }
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};



exports.getCandidate = async (req, res) => {
  try {
    const { id } = req.params
    const candidate = await Candidate.findById(id);
    res.status(200).json({ success: true, message: 'Candidate fetched successfully!', candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
}

exports.uploadCandidateResumeForUpdate = upload.single("resume");

exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse the data from the form
    const data = JSON.parse(req.body.data);

    // Fetch the existing candidate to check for the current file
    const existingCandidate = await Candidate.findById(id);

    // If a new file is uploaded, handle the file replacement
    if (req.file) {
      if (existingCandidate.resume && existingCandidate.resume.fileId) {
        // Delete the old file from GridFS
        await bucket.delete(new ObjectId(existingCandidate.resume.fileId));
      }

      // Update the candidate data with the new file information
      data.resume = {
        fileId: req.file.id,
        filename: req.file.filename,
      };
    }

    // Update the candidate information in the database
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, data, { new: true });

    if (updatedCandidate) {
      res.status(200).json({ success: true, message: 'Candidate updated successfully!' });
    } else {
      res.status(400).json({ success: false, message: 'Candidate not updated!' });
    }
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};


exports.searchCandidates = async (req, res) => {
  try {
    const query = {};
    const searchParams = req.query;

    const fields = [
      "mainFunction",
      "subFunction",
      "position",
      "candidateName",
      "dob",
      "nationality",
      "company",
      "location",
      "currentDesignation",
      "yearsOfExperience",
      "currentSalary",
      "noticePeriod",
      "reportingTo",
      "comments",
      "recruiter"
    ];

    // Add regex search for normal fields
    fields.forEach((field) => {
      if (searchParams[field]) {
        query[field] = { $regex: searchParams[field], $options: 'i' };
      }
    });

    // Add search for recruiter field (assuming recruiter is an ObjectId)
    if (searchParams.recruiter) {
      query['recruiter'] = searchParams.recruiter; // Adjust this to match your data structure
    }

    const candidates = await Candidate.find(query);
    if (candidates.length > 0) {
      res.status(200).json({ success: true, message: 'Candidates found successfully!', candidates: candidates });
    } else {
      res.status(404).json({ success: false, message: 'No candidates found!' });
    }
  } catch (error) {
    console.log(error); // Log the error for debugging purposes
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};


exports.getCandidateNames = async (req, res) => {
  try {
    const candidateNames = await Candidate.find({}, 'candidateName');
    if (candidateNames.length > 0) {
      res.status(200).json({ success: true, message: 'Candidates found successfully!', candidateNames: candidateNames });
    } else {
      res.status(404).json({ success: false, message: 'No candidates found!' });
    }
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};

exports.getCandidateNameOrg = async (req, res) => {
  try {
    const candidate = await Candidate.find({}, 'candidateName company');
    if (candidate.length > 0) {
      res.status(200).json({ success: true, message: 'Candidates found successfully!', candidate: candidate });
    } else {
      res.status(404).json({ success: false, message: 'No candidates found!' });
    }
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  const { id } = req.params; // Extract candidate ID from URL
  const { positionStatus } = req.body; // Extract positionStatus from request body
  try {
    // Fetch the candidate to check the current format of positionStatus
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found!' });
    }

    // If positionStatus is not an array, convert it to an array
    if (!Array.isArray(candidate.positionStatus)) {
      candidate.positionStatus = [];
    }

    // Ensure positionStatus from request is an array
    const positionStatusArray = Array.isArray(positionStatus) ? positionStatus : [positionStatus];

    // Push new position status into the array
    candidate.positionStatus.push(...positionStatusArray);

    const updatedCandidate = await candidate.save();

    return res.status(200).json({ success: true, message: 'Candidate updated successfully!', candidate: updatedCandidate });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return res.status(500).json({ success: false, message: 'Server error!' });
  }
};

exports.countCandidates = async (req, res) => {
  try {
    const count = await Candidate.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

