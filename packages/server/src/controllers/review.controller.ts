import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { reviewService } from "../services/review.service";
import { productRepository } from "../repositories/product.repositories";
import { reviewRepository } from "../repositories/review.repositories";

export const reviewController = {
  async getReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID." });
      return;
    }

    const product = await productRepository.getProduct(productId);
    if (!product) {
      res.status(404).json({ error: "Product does not exist" });
      return;
    }
    const reviews = await reviewRepository.getReviews(productId);
    const summary = await reviewRepository.getReviewSummary(productId);
    res.json({ summary, reviews });
  },

  async summarizeReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID." });
      return;
    }

    const product = await productRepository.getProduct(productId);
    if (!product) {
      res.status(400).json({ error: "Product does not exsist" });
      return;
    }
    const reviews = await reviewRepository.getReviews(productId, 1);
    if (!reviews.length) {
      res.status(400).json({ error: "No reviews exist for this product" });
      return;
    }

    const summary = await reviewService.summarizeReviews(productId);
    res.json({ summary });
  },
};
