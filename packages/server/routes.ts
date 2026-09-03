import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { reviewController } from "./src/controllers/review.controller";
const app = express;

const router = app.Router();

router.get("/api/products/:id/reviews", reviewController.getReviews);
router.post(
  "/api/products/:id/reviews/summarize",
  reviewController.summarizeReviews,
);

export default router;
