const mongoose = require("mongoose");
const playersModel = require("./Players");

const SeriesSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      default: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
      index: true,
    },
    games: {
      type: [
        {
          _id: false,
          players: {
            winner: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Players",
            },
            looser: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Players",
            },
          },
          score: String,
        },
      ],
      default: [],
      required: true,
    },
  },
  { timestamps: false, versionKey: false }
);

SeriesSchema.pre("find", function () {
  this.populate("games.players.winner", "name");
  this.populate("games.players.looser", "name");
});

SeriesSchema.post("save", async function (doc) {
  const game = doc.games[doc.games.length - 1];
  const players = await playersModel
    .find({})
    .where("_id")
    .in([
      mongoose.Types.ObjectId(game.players.winner._id),
      mongoose.Types.ObjectId(game.players.looser._id),
    ]);

  await Promise.all(
    players.map(async function (player) {
      const fieldsToupdate = {
        win: player.win,
        gamesPlayed: player.gamesPlayed,
        series: [...player.series],
      };

      if (!player.series.includes(doc._id)) {
        fieldsToupdate.series.push(doc._id);
      }

      if (game.players.winner._id.toString() === player._id.toString()) {
        fieldsToupdate.win = fieldsToupdate.win + 1;
        fieldsToupdate.gamesPlayed = fieldsToupdate.gamesPlayed + 1;
      }

      if (game.players.looser._id.toString() === player._id.toString()) {
        fieldsToupdate.gamesPlayed = fieldsToupdate.gamesPlayed + 1;
      }

      return await playersModel.findByIdAndUpdate(player._id, {
        ...fieldsToupdate,
      });
    })
  );
});

const Series = mongoose.model("Series", SeriesSchema);

module.exports = Series;
