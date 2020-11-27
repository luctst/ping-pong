require('dotenv').config();
const mongoose = require('mongoose');
const {prompt} = require('inquirer');

const PlayersModel = require('./api/models/Players');
const SeriesModel = require('./api/models/Series');

async function add () {
    const aswr = await prompt([
        {
            name: 'collection',
            type: 'list',
            message: 'In which collection would you like to inject datas ?',
            choices: ['players', 'series']
        },
        {
            name: 'useMockData',
            type: 'confirm',
            message: 'Would you like to inject some datas ?',
            when: function (a) {
                if (a.collection === 'series') return true;
                return false;
            }
        }
    ]);

    if (aswr.collection === 'players') {
        const players = [
            {name: 'thomas'}, 
            {name: 'antoine'}, 
            {name: 'léo'}, 
            {name: 'lucas'},
            {name: 'mathilde'}
        ];

        await PlayersModel.insertMany([ ...players  ]);
    }

    if (aswr.collection === 'series') {
        const players = await PlayersModel.find({});
        const series = await SeriesModel.find({});
        const dateToday = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
        const serie = series.find(serie => serie.date === dateToday);

        if (players.length > 2) {
            const playersId = players.map(player => player.id);
            const games = [];

            for (let index = 1; index <= 1; index++) {
                const playersIdCopy = [...playersId];
                const winner = playersIdCopy[Math.floor(Math.random() * playersIdCopy.length)];

                playersIdCopy.splice(
                    playersIdCopy.findIndex(i => i === winner),
                    1
                );

                games.push({
                    score: `11-${Math.floor(Math.random() * 11)}`,
                    players: {
                        winner,
                        looser: playersIdCopy[Math.floor(Math.random() * playersIdCopy.length)]
                    }
                });
            }

            if (serie) {
                return await SeriesModel.findByIdAndUpdate(serie._id, {games: [ ...serie.games, ...games]})
            }

            return await new SeriesModel({ games: aswr.useMockData ? await populateRealSeries() :  [...games] }).save();
        }

        return process.stderr.write('You must add some players before');
    }
}

async function populateRealSeries () {
    const PlayersList = await PlayersModel.find({});
    const playerName = PlayersList.map(player => player.name);
    const promptData = [];
    const games = {};
    const newSerie = {
        date: '15/11/2020',
        games: []
    };

    playerName.forEach(function (namePlayer) {
        PlayersList.forEach(function (player) {
            if (namePlayer === player.name) return false;

            return promptData.push({
                type: 'number',
                name: `${namePlayer}-${player.name}`,
                message: `${namePlayer} how many games you win against ${player.name} ?`,
                default: 0,
                validate (userAswr) {
                    if (games[namePlayer]) {
                        games[namePlayer][player.name] = userAswr;
                        return true;
                    }

                    games[namePlayer] = {}; 
                    games[namePlayer][player.name] = userAswr;
                    return true;
                }
            });
        });
    });

    await prompt(promptData);

    Object.keys(games).forEach(function (player) {
        const playerId = PlayersList.find(p => p.name === player).id;

        Object.keys(games[player]).forEach(function (opponents) {
            if (games[player][opponents] <= 0) return;
            const opponentId = PlayersList.find(p => p.name === opponents);

            for (let index = 0; index <= games[player][opponents]; index++) {
                newSerie.games.push({
                    players: {
                        winner: playerId,
                        looser: opponentId
                    },
                    score: "-"
                });
            }
        });
    });

    await new SeriesModel({ ...newSerie}).save();
}

async function populateName() {
    const players = await PlayersModel.find({});
    const series = await SeriesModel.find({});

    if (series.length) {
        return await Promise.all(players.map(async function (player) {
            const fieldsToupdate = {
                win: player.win,
                gamesPlayed: player.gamesPlayed,
                series: [ ...player.series]
            };
            
            series.forEach(function (serie) {
                serie.games.forEach(function (game) {
                    if (game.players.winner._id.toString() === player._id.toString()) {
                        if (!fieldsToupdate.series.includes(serie._id)) {
                            fieldsToupdate.series.push(serie._id)
                        }

                        fieldsToupdate.win = fieldsToupdate.win + 1;
                        fieldsToupdate.gamesPlayed = fieldsToupdate.gamesPlayed + 1;
                        return;
                    }

                    if (game.players.looser._id.toString() === player._id.toString()) {
                        if (!fieldsToupdate.series.includes(serie._id)) {
                            fieldsToupdate.series.push(serie._id);
                        }

                        fieldsToupdate.gamesPlayed = fieldsToupdate.gamesPlayed + 1;
                        return;
                    }
                });
            });

            return await PlayersModel.findByIdAndUpdate(player._id, { ...fieldsToupdate  });
        }));
    }

    return process.stderr.write('You must add some series before populate');
}

async function dePopulate() {
    const reset = {
        gamesPlayed: 0,
        win: 0,
        series: []
    };

    await PlayersModel.updateMany({}, { ...reset });
}

async function deleteData() {
    const aswr = await prompt([
        {
            name: 'collections',
            type: 'list',
            choices: ['series']
        }
    ]);

    if (aswr.collections === 'series' || aswr.collections === 'all') {
        await SeriesModel.deleteMany({});
    }
}

async function main () {
    const actionName = process.argv[process.argv.length - 1].split('=')[1];

    if (!actionName) {
        process.stderr.write('You must add the --action flag');
        return process.exit(0);
    }

    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            bufferCommands: false,
            useFindAndModify: false
        });

        switch (actionName) {
            case 'add':
                return await add();
            case 'populate':
                return await populateName();
            case 'delete':
                return await deleteData();
            case 'depopulate':
                return await dePopulate();
            case 't':
                return await populateRealSeries();
            default:
                break;
        }

        await mongoose.connection.close();
    } catch (error) {
        throw error
    }
}

main().then(() => process.exit(0));