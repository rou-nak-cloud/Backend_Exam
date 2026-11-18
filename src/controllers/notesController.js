import { notesModel } from "../models/notesModel.js";

const createTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: `Missing user context.`,
      });
    }
    const { title, description } = req.body;

    const existingTask = await notesModel.findOne({
      title,
      userId: req.userId,
    });
    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: `Same title task already exists for this user..`,
        data: existingTask,
      });
    }
    const createTask = await notesModel.create({
      title,
      description,
      userId: req.userId,
    });
    return res.status(201).json({
      success: true,
      message: `Task created successfully.`,
      data: createTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: `Missing user context.`,
      });
    }
    const allTask = await notesModel.find({ userId: req.userId });
    return res.status(200).json({
      success: true,
      message: `${allTask.length === 0 ? "No task found to show" : "All task founded."}`,
      data: allTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: `Missing user context.`,
      });
    }
    const id = req.params.id;

    const deleteTaskPresent = await notesModel.findById(id);
    if (!deleteTaskPresent) {
      return res.status(400).json({
        success: false,
        message: `No task found in database.`,
      });
    }
    const deleteTask = await notesModel.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!deleteTask) {
      return res.status(400).json({
        success: false,
        message: `No permission to delete this todo..`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `Task deleted successfully.`,
      data: deleteTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: `Missing user context.`,
      });
    }
    const id = req.params.id;
    const { title, description } = req.body;

    const existingTask = await notesModel.findOne({ _id: id });
    if (!existingTask) {
      return res.status(400).json({
        success: false,
        message: `Todo not found to update.`,
      });
    } else if (existingTask.title === title) {
      return res.status(400).json({
        success: false,
        message: `Same title todo found.`,
        data: existingTask,
      });
    }

    const updateTaskUser = await notesModel.findOne({
      _id: id,
      userId: req.userId,
    });
    if (!updateTaskUser) {
      return res.status(400).json({
        success: false,
        message: `You dont have permission to update this todo.`,
      });
    }
    const updateTask = await notesModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, description },
      { new: true },
    );
    return res.status(201).json({
      success: true,
      message: `Task updated successfully.`,
      data: updateTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error.`,
    });
  }
};

export { createTask, getAllTasks, deleteTask, updateTask };
