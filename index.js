require('dotenv').config();
const express = require("express");
const passport = require('passport');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8888;
const facebookRouter = require("./routes/facebookRouter");
const { connection, initData } = require('./config/db');
app.use(express.json());
app.disable("X-Powered-By");
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: 'sucess' })
});

app.use("/facebook", facebookRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = 400;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production') {
    const conn = await connection();// connect to db
    await initData(conn);
  }
});
