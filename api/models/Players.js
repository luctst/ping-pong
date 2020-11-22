const mongoose = require("mongoose");

const PlayersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["antoine", "thomas", "léo", "lucas", "mathilde"],
    },
    gamesPlayed: {
      type: Number,
      default: 0,
      min: 0,
    },
    win: {
      type: Number,
      default: 0,
      min: 0,
    },
    series: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Series",
        },
      ],
      default: [],
    },
  },
  { timestamps: false, versionKey: false }
);

const Players = mongoose.model("Players", PlayersSchema);

module.exports = Players;
