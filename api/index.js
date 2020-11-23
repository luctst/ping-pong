require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");

const initDb = require("./middlewares/initDb");
const playersRouter = require("./routes/players");
const response = require("./utils/response");

app.use(
  cors({
    // origin:
    //   process.env.NODE_ENV === "development"
    //     ? process.env.CORS_ORIGIN_DEV
    //     : process.env.CORS_ORIGIN_PROD,
    origin: '*',
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: 'Content-Type, Authorization, X-api-key',
    preflightContinue: false
  })
);
// app.options('*', function (req, res) {
//   return response(res, 204);
// })

app.use(compression());
app.use(express.json());
app.use(initDb());

app.use("/api/player", playersRouter);

app.listen(4000);
