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

module.exports.trimFile = async (req, res) => {
  const { start, end } = req.body;
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) {
      console.log("video not found");
      return res.status(404).send("Video not found");
    }

    const outputPath = `./outputs/trimmed_${Date.now()}.mp4`;
    ffmpeg(video.filePath)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputPath)
      .on("end", async () => {
        video.filePath = outputPath;
        await video.save();
        res.send({ message: "Video trimmed", path: outputPath });
      })
      .on("error", (err) => {
        console.log("FFmpeg error:", err);
        res.status(500).send(err.message);
      })
      .run();
  } catch (error) {
    console.log(error);
    res.status(500).json("internal error");
  }
};
