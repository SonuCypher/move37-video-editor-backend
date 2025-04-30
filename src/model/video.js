const { DataTypes } = require("sequelize");
const sequelize = require("../config/db")


const Video = sequelize.define('Video', {
    name: DataTypes.STRING,
    duration: DataTypes.FLOAT,
    size: DataTypes.INTEGER,
    status: { type: DataTypes.STRING, defaultValue: 'uploaded' },
    filePath: DataTypes.STRING,
    finalPath: DataTypes.STRING,
  });

  module.exports = Video