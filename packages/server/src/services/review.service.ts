import { Review } from "../generated/prisma/client";
import { reviewRepository } from "../repositories/review.repositories";
import { llmClient } from "../../llm/client";
import template from "../../prompt/summarize-reviews.txt";
export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }
    const reviews = await reviewRepository.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join("\n\n");
    const prompt = template.replace("{{reviews}}", joinedReviews);

    const { text: summary } = await llmClient.generateText({
      model: "gpt-5-mini",
      prompt,
      maxTokens: 500,
    });

    await reviewRepository.storeReviewsSummary(productId, summary);
    return summary;
  },
};
