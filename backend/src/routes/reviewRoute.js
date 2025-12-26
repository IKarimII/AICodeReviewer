import express from "express";

import { handleReviewRequest } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/review", handleReviewRequest);

export default router;
