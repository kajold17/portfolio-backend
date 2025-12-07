import express from "express";
import chatHandler from "./api/chat.js";
import cors from "cors";

const app = express();
app.use(cors());  // Allow cross-origin requests
app.use(express.json());

// test root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// expose your chat handler
app.post("/api/chat", (req, res) => chatHandler(req, res));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Local server running on http://localhost:${PORT}`);
});
