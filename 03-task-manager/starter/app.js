require("dotenv").config();
const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const connectDataBase = require("./database/connector");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("./public"));
app.get("/hello", (req, res) => {
  res.send("task manager app");
});

app.use("/api/v1/tasks", tasks);
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDataBase(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
