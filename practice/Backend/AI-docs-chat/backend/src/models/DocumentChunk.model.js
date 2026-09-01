const mongoose = require('mongoose')

const documentChunkSchema = new mongoose.Schema(
    {
        documentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            required: true,
            index: true,
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        content: {
            type: String,
            required: true,
        },
        embedding: {
            type: [Number],
            required: true,
        },
        chunkIndex: {
            type: Number,
            required: true,
        },

        tokenCount: {
            type: Number,
            required: true,
        },

        startToken: {
            type: Number,
            required: true,
        },

        endToken: {
            type: Number,
            required: true,
        },

        pageNumber: {
            type: Number,
            default: null,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const DocumentChunk = mongoose.model(
    "DocumentChunk",
    documentChunkSchema
);

module.exports = DocumentChunk;