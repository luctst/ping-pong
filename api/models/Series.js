const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Series',
    new mongoose.Schema({
        date: {
            type: Date
        },
        games: {
            type: [{
                players: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Players'
                }],
                winner: mongoose.Schema.Types.ObjectId,
                score: [Number]
            }],
            default: []
        }
    }, {timestamps: false,  versionKey: false})
);