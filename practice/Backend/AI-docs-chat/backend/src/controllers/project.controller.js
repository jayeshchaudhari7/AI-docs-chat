const Project = require("../models/Project.model");

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      userId: req.user.userId,
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.userId,
      },
      {
        name,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {createProject,getProjects ,getProject,updateProject,deleteProject}