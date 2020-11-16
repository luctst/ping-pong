require('dotenv').config();
const mongoose = require('mongoose');

const PlayersModel = require('./api/models/Players');

async function main () {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            bufferCommands: false
        });

        const populatePlayers = ['Thomas', 'Antoine', 'Léo', 'Lucas'];
        await Promise.all(populatePlayers.map(i => new PlayersModel({ name: i }.save())));
    } catch (error) {
        throw error
    }
}

main().then(process.exit(0));