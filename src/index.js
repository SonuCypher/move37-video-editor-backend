const express = require('express');
require('dotenv').config();
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const sequelize = require("./config/db");

const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error("Unable to connect");
    // console.log(err)
  });

  app.listen(3000, () => {
    console.log("listening on 3000");
  });