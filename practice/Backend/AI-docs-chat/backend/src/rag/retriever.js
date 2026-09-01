const mongoose = require("mongoose");

const DocumentChunk = require("../models/DocumentChunk.model.js");

const searchSimilarChunks = async ({
  queryEmbedding,
  userId,
  projectId,
  limit = 5,
}) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const projectObjectId =new mongoose.Types.ObjectId(projectId);

  const results = await DocumentChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",

        path: "embedding",

        queryVector: queryEmbedding,

        numCandidates: Math.max(limit * 20, 100),

        limit,

        filter: {
          userId: userObjectId,
          projectId: projectObjectId,
        },
      },
    },

    {
      $project: {
        _id: 1,

        content: 1,

        documentId: 1,

        projectId: 1,

        userId: 1,

        chunkIndex: 1,

        tokenCount: 1,

        pageNumber: 1,

        metadata: 1,

        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  return results;
};


module.exports = searchSimilarChunks