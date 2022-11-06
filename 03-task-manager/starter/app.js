const express = require("express");
const port = 3000;
const app = express();
const tasks = require("./routes/tasks");
const connectDataBase = require("./database/connector");
const notFound = require("./middleware/not-found");
require("dotenv").config();

app.use(express.json());
app.use(express.static("./public"));
app.get("/hello", (req, res) => {
  res.send("task manager app");
});

app.use("/api/v1/tasks", tasks);
app.use(notFound);

const start = async () => {
  try {
    await connectDataBase(process.env.MONGO_URI);
    app.listen(port, console.log("server is listening"));
  } catch (error) {
    console.log(error);
  }
};

start();
