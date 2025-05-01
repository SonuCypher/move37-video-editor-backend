const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Video = require("../model/video");

const uploadFile = async (req, res) => {
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

const trimFile = async (req, res) => {
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

const addSubtitle = async (req, res) => {
  const { text, start, end } = req.body;
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).send("Video not found");

    const subtitlePath = `./outputs/sub_${Date.now()}.mp4`;
    const drawtext = `drawtext=text='${text}':enable='between(t,${start},${end})':fontcolor=white:fontsize=24:x=10:y=H-th-10`;

    ffmpeg(video.filePath)
      .videoFilter(drawtext)
      .output(subtitlePath)
      .on("end", async () => {
        video.filePath = subtitlePath;
        await video.save();
        res.send({ message: "Subtitle added", path: subtitlePath });
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

const renderVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).send("Video not found");

    const finalPath = `./outputs/final_${Date.now()}.mp4`;
    fs.copyFile(video.filePath, finalPath, async (err) => {
      if (err) return res.status(500).send(err.message);
      video.finalPath = finalPath;
      video.status = "rendered";
      await video.save();
      res.send({ message: "Video rendered", path: finalPath });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal error");
  }
};

module.exports = { uploadFile, trimFile, addSubtitle, renderVideo };
