import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

// connect DB BEFORE starting server
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});