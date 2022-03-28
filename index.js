require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8888;
const programmingLanguagesRouter = require("./routes/programmingLanguages");
const facebookCallbackRouter = require("./routes/facebookCallbackRouter");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/programming-languages", programmingLanguagesRouter);
app.use("/fb", facebookCallbackRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
