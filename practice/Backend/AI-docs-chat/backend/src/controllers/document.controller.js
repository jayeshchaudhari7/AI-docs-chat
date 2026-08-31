const fs = require("fs/promises")
const Document = require("../models/Document.model.js")
const Project = require("../models/Project.model.js")
const extractTextFromFile = require("../services/document.service.js");

const uploadDocument = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.userId,
    });

    if (!project) {
      await fs.unlink(req.file.path);

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const document = await Document.create({
      projectId,
      userId: req.user.userId,

      filename: req.file.filename,

      originalName: req.file.originalname,

      fileType: req.file.mimetype,

      fileSize: req.file.size,

      storagePath: req.file.path,

      status: "processing",
    });

    try {
      const extracted = await extractTextFromFile(
        req.file.path,
        req.file.mimetype
      );

      document.status = "processed";

      document.totalPages = extracted.totalPages;

      await document.save();

      return res.status(201).json({
        success: true,
        message: "Document uploaded and processed successfully",

        document: {
          id: document._id,
          projectId: document.projectId,
          originalName: document.originalName,
          fileType: document.fileType,
          fileSize: document.fileSize,
          status: document.status,
          totalPages: document.totalPages,
        },

        textLength: extracted.text.length,
      });
    } catch (processingError) {
      document.status = "failed";

      await document.save();

      console.error(
        "Document processing error:",
        processingError
      );

      return res.status(500).json({
        success: false,
        message: "Document processing failed",
      });
    }
  } catch (error) {
    console.error("Upload document error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = uploadDocument