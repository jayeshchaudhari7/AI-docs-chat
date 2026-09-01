const { pipeline } = require("@xenova/transformers");

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractor;
};

// Generate embedding for a single text
const generateEmbedding = async (text) => {
  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};


// Generate embeddings for multiple texts
const generateEmbeddings = async (texts) => {
  if (!texts || texts.length === 0) {
    return [];
  }

  const model = await getExtractor();

  const output = [];

  for (const text of texts) {
    const embedding = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    output.push(
      Array.from(embedding.data)
    );
  }

  return output;
};


module.exports = {
  generateEmbedding,
  generateEmbeddings,
};


// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const EMBEDDING_MODEL =
//   process.env.EMBEDDING_MODEL || "text-embedding-3-small";

// const generateEmbeddings = async (texts) => {
//   if (!texts.length) {
//     return [];
//   }

//   const response = await openai.embeddings.create({
//     model: EMBEDDING_MODEL,
//     input: texts,
//   });

//   return response.data
//     .sort((a, b) => a.index - b.index)
//     .map((item) => item.embedding);
// };

// const generateEmbedding = async (text) => {
//   const embeddings = await generateEmbeddings([text]);

//   return embeddings[0];
// };

// module.exports = {
//   generateEmbedding,
//   generateEmbeddings
// };