const express = require("express")
const router = express.Router();
const auth = require("../middleware/auth")
const { addUser, getUsers, deleteUser, updateUser, loginUser, getUser, countUsers, userRole, getUserNames } = require('../controller/userController');

router.post("/addUser", auth, addUser);
router.get("/getUsers", auth, getUsers);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
router.get("/getUser/:id", getUser);
router.post("/loginUser", loginUser);
router.get("/countUsers", countUsers)
router.get("/userRole", auth, userRole)
router.get("/getUserNames", getUserNames)

module.exports = router;