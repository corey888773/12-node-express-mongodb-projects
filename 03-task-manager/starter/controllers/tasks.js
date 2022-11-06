const Task = require("../models/Task");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(201).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const addNewTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });
    if (!task) {
      return res
        .status(404)
        .json({ msg: `no task with id : ${req.params.id}` });
    }
    return res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }

  res.json({ id: req.params.id });
};

const updateSingleTask = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send(`No task with id : ${taskID}`, 404);
    }

    return res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }

  res.json({ id: req.params.id });
};

const deleteSingleTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
    if (!task) {
      return res
        .status(404)
        .json({ msg: `no task with id : ${req.params.id}` });
    }
    return res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }

  res.json({ id: req.params.id });
};
module.exports = {
  getAllTasks,
  addNewTask,
  getSingleTask,
  updateSingleTask,
  deleteSingleTask,
};
