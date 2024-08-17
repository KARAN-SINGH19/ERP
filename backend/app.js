const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const candidateRoutes = require("../backend/routes/candidateRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const clientRoutes = require("../backend/routes/clientRoutes");
const positionRoutes = require("../backend/routes/positionRoutes")
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:7000" }));

// Route setup
app.use('/api/v1', candidateRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', clientRoutes);
app.use('/api/v1', positionRoutes);

module.exports = app;
