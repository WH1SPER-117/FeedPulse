import express from "express";
import cors from "cors";
import feedbackRoutes from "./routes/feedback.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/feedback", feedbackRoutes);

export default app;