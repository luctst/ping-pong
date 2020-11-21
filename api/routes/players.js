const express = require("express");
const router = express.Router();

const response = require("../utils/response");
const addGameController = require("../controller/addGame");
const getPlayersData = require("../controller/getPlayersDatas");

router.get("/", async function (req, res) {
  const responseController = await getPlayersData();

  const responseFormated = responseController.modifyResponse.map(function (p) {
    const dataToReturn = {
      ...p._doc,
      scores: {},
    };

    p.series.map(function (l) {
      l.games.map(function (t) {
        // If my id is in this game
        if (t.players.winner._id.toString() === p._id.toString() || t.players.looser._id.toString() === p._id.toString()) {
          // If i lost against someone
          if (t.players.looser._id.toString() === p._id.toString()) {
            // If in score the score is already declared
            if (dataToReturn.scores[t.players.winner.name]) {
              return (
                dataToReturn.scores[t.players.winner.name].loose = dataToReturn.scores[t.players.winner.name].loose + 1
              );
            }
  
            return (dataToReturn.scores[t.players.winner.name] = {
              win: 0,
              loose: 1,
            });
          }

          if (dataToReturn.scores[t.players.looser.name]) {
            return (dataToReturn.scores[t.players.looser.name].win =
              dataToReturn.scores[t.players.looser.name].win + 1);
          }
  
          return (dataToReturn.scores[t.players.looser.name] = {
            win: 1,
            loose: 0,
          });
        }
      });
    });

    return dataToReturn;
  });

  return response(res, responseController.code, {
    serverHeader: responseController.serverHeader
      ? { ...responseController.serverHeader }
      : undefined,
    content: responseController.content
      ? responseController.content
      : undefined,
    modifyResponse: [...responseFormated],
  });
});

router.post("/add", async function (req, res) {
  const b = Object.keys(req.body);

  if (!b.length) {
    return response(res, 422);
  }

  if (b.length > 2) {
    return response(res, 422);
  }

  if (!b.includes("players") || !b.includes("score")) {
    return response(res, 422);
  }

  const responseController = await addGameController({
    ...req.body,
    session: `${new Date().getDate()}/${
      new Date().getMonth() + 1
    }/${new Date().getFullYear()}`,
  });

  return response(res, responseController.code, {
    serverHeader: responseController.serverHeader
      ? { ...responseController.serverHeader }
      : undefined,
    content: responseController.content
      ? responseController.content
      : undefined,
    modifyResponse: responseController.modifyResponse
      ? { ...responseController.modifyResponse }
      : undefined,
  });
});

module.exports = router;
