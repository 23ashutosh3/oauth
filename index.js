const express = require("express");
//const mongoose = require("mongoose");

const db = require('./config/mongoose');
const mongoose = require('mongoose');

require("dotenv").config();
const app = express();
app.use(express.json());

const PORT = process.env.PORTn || 5000
app.listen(PORT, () => console.log("The server has started on port:", PORT));




app.use("/users", require("./routes/userRouter"));