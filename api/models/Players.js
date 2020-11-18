const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Players',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            enum: ['antoine', 'thomas', 'léo', 'lucas']
        },
        gamesPlayed: {
            type: Number,
            default: 0,
            min: 0
        },
        win: {
            type: Number,
            default: 0,
            min: 0
        },
        series: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Series'
            }],
            default: [],
        }
    }, {timestamps: false, versionKey: false})
)