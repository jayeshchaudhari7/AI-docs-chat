const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const projectRoutes = require('./routes/project.routes')
const documentRoutes = require('./routes/document.routes')
const { tokenize } = require('./rag/tokenizer')


const app = express()

connectDB()

app.use(express.json())
app.use(cors({
   origin:process.env.CLIENT_URL
}))

app.get("/", (req, res) => {
  res.json({
    message: "DocuMind API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", documentRoutes);

// const text =
//   "The application uses JWT authentication.";

// const tokens = tokenize(text);

// console.log(tokens);
// console.log(tokens.length);

module.exports = app