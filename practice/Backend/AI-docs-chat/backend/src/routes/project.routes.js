const express = require("express");
const{
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller.js");

const protect  = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProject);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports =router;