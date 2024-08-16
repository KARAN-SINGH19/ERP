const express = require("express")
const auth = require("../middleware/auth")
const router = express.Router();
const { addPosition, getPositions, deletePosition, getPosition, updatePosition, searchPositions, countPositions, fetchPositions, addHiring, getHirings, updateRemark, deleteHiring, countPositionsByClient, countHiringStatus, updateComment, updateStatus, countActivePosition, displayActivePosition, displayClosePosition, updateLocation } = require('../controller/positionController');

router.post("/addPosition", auth, addPosition);
router.get("/getPositions", auth, getPositions)
router.get("/getPosition/:id", getPosition)
router.put("/updatePosition/:id", updatePosition);
router.delete("/deletePosition/:id", deletePosition)
router.get('/searchPositions', searchPositions);
router.get("/countPositions", countPositions)
router.get('/fetchPositions/:client', fetchPositions);

router.post("/addHiring", auth, addHiring);
router.get("/getHirings", auth, getHirings)
router.put('/updateRemark/:id', updateRemark);
router.delete('/deleteHiring/:id', deleteHiring);

router.get('/countPositionsByClient', countPositionsByClient);
router.get('/countHiringStatus', countHiringStatus);
router.get('/countActivePosition', countActivePosition);
router.get('/displayActivePosition', displayActivePosition);
router.get('/displayClosePosition', displayClosePosition);

router.put('/updateComment/:id', updateComment)
router.put('/updateStatus/:id', updateStatus);
router.put('/updateLocation/:id', updateLocation);

module.exports = router;