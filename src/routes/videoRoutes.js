const express = require('express');
const path = require("path");
const router = express.Router();
const multer = require('multer');
const { uploadFile, trimFile, addSubtitle, renderVideo, downloadVideo } = require('../controller/videoController');


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });


  router.post('/upload',upload.single('video'),uploadFile)
  router.post('/:id/trim',trimFile)
  router.post('/:id/subtitles',addSubtitle)
  router.post('/:id/render',renderVideo)
  router.get('/:id/download',downloadVideo)

module.exports = router