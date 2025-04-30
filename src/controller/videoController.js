const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../model/video");

module.exports.uploadFile = async (req, res) => {
  const { originalname, path: filePath, size } = req.file;

  try {
    const existingVideo = await Video.findOne({
      where: { name: originalname },
    });

    if (existingVideo) {
      return res.status(409).json("Video with this name already exists");
    }
    ffmpeg.ffprobe(filePath, async (err, metadata) => {
      if (err) {
        console.log(err);
        return res.json("error uploading the file");
      }
      const duration = metadata.format.duration;
      const video = await Video.create({
        name: originalname,
        duration,
        size,
        filePath,
      });
      res.status(200).json(video);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal error");
  }
};
