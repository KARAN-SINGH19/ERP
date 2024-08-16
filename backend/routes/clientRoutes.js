const express = require("express")
const router = express.Router();
const auth = require("../middleware/auth")
const { addClient, getClients, deleteClient, updateClient, getClient, searchClients, getClientNames, countClients } = require('../controller/clientController');

router.post("/addClient", auth, addClient);
router.get("/getClients", auth, getClients);
router.delete("/deleteClient/:id", deleteClient);
router.put("/updateClient/:id", updateClient);
router.get("/getClient/:id", getClient);
router.get('/searchClients', searchClients);
router.get('/getClientNames', getClientNames);
router.get("/countClients", countClients)

module.exports = router;