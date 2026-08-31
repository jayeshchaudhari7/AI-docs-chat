const fs = require("fs/promises")
const path = require("path")
const pdfParse = require("pdf-parse")
const mammoth= require("mammoth")


const extractTextFromFile = async (
  filePath,
  fileType
) => {
  if (fileType === "application/pdf") {
    const buffer = await fs.readFile(filePath);

    const data = await pdfParse(buffer);

    return {
      text: data.text,
      totalPages: data.numpages,
    };
  }

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return {
      text: result.value,
      totalPages: null,
    };
  }

  if (
    fileType === "text/plain" ||
    fileType === "text/markdown"
  ) {
    const text = await fs.readFile(filePath, "utf-8");

    return {
      text,
      totalPages: null,
    };
  }

  throw new Error("Unsupported file type");
};

module.exports = extractTextFromFile