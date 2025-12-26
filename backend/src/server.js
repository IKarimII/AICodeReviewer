import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import reviewRoute from "./routes/reviewRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use("/request", reviewRoute);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error:
        "Invalid JSON in request body. Send valid JSON with Content-Type: application/json.",
    });
  }
  next(err);
});

app.listen(PORT, () => console.log(`The server is running on Port ${PORT}`));
