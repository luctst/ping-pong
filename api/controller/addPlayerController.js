const PlayersModel = require('../models/Players');

module.exports = async function addPlayerController (data) {
    await new PlayersModel({name: data.playerName}).save();

    return {
        code: 200
    }
}