const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")
const { addCandidate, uploadCandidateResume, getCandidates, downloadResume, deleteCandidate, updateCandidate, getCandidate, searchCandidates, uploadCandidateResumeForUpdate, getCandidateNames, updateCandidateStatus, countCandidates, getCandidateNameOrg } = require('../controller/candidateController');

router.post("/addCandidate", auth, uploadCandidateResume, addCandidate);
router.get("/getCandidates", getCandidates);
router.get("/getCandidate/:id", getCandidate);
router.get('/downloadResume/:fileId', downloadResume);
router.put('/updateCandidate/:id', uploadCandidateResumeForUpdate, updateCandidate);
router.delete('/deleteCandidate/:id', deleteCandidate);
router.get('/searchCandidates', searchCandidates);
router.get('/getCandidateNames', getCandidateNames);
router.put('/updateCandidateStatus/:id', updateCandidateStatus);
router.get("/countCandidates", countCandidates)
router.get("/getCandidateNameOrg", getCandidateNameOrg)

router.get('/welcome', (req, res) => {
    res.json({ message: 'Welcome to the Talent Vault API!' });
});

module.exports = router;

