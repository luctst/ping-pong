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

const Series = mongoose.model("Series", SeriesSchema);

Series.watch().on("change", async function (newData) {
  if (newData.operationType === "update") {
    const fieldUpdate = Object.keys(newData.updateDescription.updatedFields)[0];
    const playersSession = await playersModel
      .where("_id")
      .in([
        mongoose.Types.ObjectId(
          newData.updateDescription.updatedFields[fieldUpdate].players.winner
        ),
        mongoose.Types.ObjectId(
          newData.updateDescription.updatedFields[fieldUpdate].players.looser
        ),
      ]);

    await Promise.all(
      playersSession.map(async (p) => {
        const fieldsToUpdate = {
          gamesPlayed: p.gamesPlayed + 1,
        };

        if (!p.series.includes(newData.documentKey._id)) {
          fieldsToUpdate.$push = { series: newData.documentKey._id };
        }

        if (
          newData.updateDescription.updatedFields[
            fieldUpdate
          ].players.winner.toString() === p._id.toString()
        ) {
          fieldsToUpdate.win = p.win + 1;
        }

        await playersModel.updateOne(
          { _id: mongoose.Types.ObjectId(p._id) },
          { ...fieldsToUpdate }
        );
      })
    );
  }
});

module.exports = Series;
