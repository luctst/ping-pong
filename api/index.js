require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');

const initDb = require('./middlewares/initDb');
const playersRouter = require('./routes/players');

app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(initDb());

app.use('/api/player', playersRouter);

app.listen(4000);