require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const initDb = require('./middlewares/initDb');
const playersRouter = require('./routes/players');

app.use(compression());
app.use(
    cors({
        origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(initDb());

app.use('/api/players', playersRouter);

app.listen(4000);