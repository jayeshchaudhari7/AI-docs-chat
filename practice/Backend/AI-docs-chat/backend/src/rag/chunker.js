const {
  tokenize,
  decodeTokens,
} =  require("./tokenizer.js");

const DEFAULT_CHUNK_SIZE = 800;
const DEFAULT_OVERLAP = 100;

const createChunks = (
  text,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP
) => {
  const tokens = tokenize(text);

  const chunks = [];

  let start = 0;

  while (start < tokens.length) {
    const end = Math.min(
      start + chunkSize,
      tokens.length
    );

    const chunkTokens = tokens.slice(start, end);

    const content = decodeTokens(chunkTokens);

    chunks.push({
      content,
      tokenCount: chunkTokens.length,
      startToken: start,
      endToken: end,
    });

    if (end >= tokens.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
};

module.exports = createChunks