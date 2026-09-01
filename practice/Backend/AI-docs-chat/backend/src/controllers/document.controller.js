const fs = require("fs/promises")
const Document = require("../models/Document.model.js")
const Project = require("../models/Project.model.js")
const extractTextFromFile = require("../services/document.service.js");
const cleanText = require("../rag/cleaner.js");
const createChunks = require("../rag/chunker.js");
const DocumentChunk = require("../models/DocumentChunk.model.js");
const { generateEmbeddings } = require("../services/embedding.service.js");
const { generateEmbedding } = require("../services/embedding.service.js");
const  searchSimilarChunks  = require("../rag/retriever.js");


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

      const cleanedText = cleanText(
        extracted.text
      );

      const chunks = createChunks(
        cleanedText
      );

      const chunkTexts = chunks.map(
        (chunk) => chunk.content
      );

      const embeddings = await generateEmbeddings(
        chunkTexts
      );

      const chunkDocuments = chunks.map(
        (chunk, index) => ({
          documentId: document._id,

          projectId: document.projectId,

          userId: document.userId,

          content: chunk.content,

          embedding: embeddings[index],

          chunkIndex: index,

          tokenCount: chunk.tokenCount,

          startToken: chunk.startToken,

          endToken: chunk.endToken,

          pageNumber: null,

          metadata: {
            fileType: document.fileType,
            originalName: document.originalName,
          },
        })
      );

      await DocumentChunk.deleteMany({
        documentId: document._id,
      });

      if (chunkDocuments.length > 0) {
        await DocumentChunk.insertMany(
          chunkDocuments
        );
      }

      document.totalChunks =
        chunkDocuments.length;

      document.status = "processed";

      await document.save();

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


const testSemanticSearch = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      question,
    } = req.body;

    if (!projectId || !question) {
      return res.status(400).json({
        success: false,
        message:
          "Project ID and question are required",
      });
    }

    const queryEmbedding = await generateEmbedding(question);
    const results = await searchSimilarChunks({
      queryEmbedding,

      userId: req.user.userId,

      projectId,

      limit: 5,
    });

    
    return res.status(200).json({
      success: true,

      question,

      results,
    });
  } catch (error) {
    console.error(
      "Semantic search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Semantic search failed",
    });
  }
};

module.exports = { uploadDocument, testSemanticSearch }