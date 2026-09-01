const dotenv = require("dotenv");

dotenv.config();

const { generateEmbedding } = require("./services/embedding.service");

const test = async () => {
  const text =
    "The application uses JWT authentication.";

  const embedding = await generateEmbedding(text);

  console.log("Embedding dimensions:", embedding.length);
  console.log(embedding.slice(0, 10));
};

test();