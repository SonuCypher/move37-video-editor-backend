const express = require('express');
require('dotenv').config();
const sequelize = require("./config/db");
require("./model/video")
const videoRoutes = require('./routes/videoRoutes')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

sequelize
  .authenticate()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error("Unable to connect");
    // console.log(err)
  });

  app.use('/api/videos',videoRoutes)

  app.listen(3000, () => {
    console.log("listening on 3000");
  });