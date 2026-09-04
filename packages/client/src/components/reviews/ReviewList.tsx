import axios from "axios";
import { StarRating } from "./StarRating";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { HiSparkles } from "react-icons/hi";
import { useState } from "react";
import { ReviewSkeleton } from "./ReviewSkeleton";
type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

type SummarizeResponse = {
  summary: string;
};
export const ReviewList = ({ productId }: Props) => {
  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery<GetReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(),
  });

  const fetchReviews = async () => {
    const { data } = await axios.get<GetReviewsResponse>(
      `/api/products/${productId}/reviews`,
    );
    return data;
  };

  const handleSummarize = async () => {
    try {
      setIsSummaryLoading(true);
      setSummaryError("");
      const { data } = await axios.post<SummarizeResponse>(
        `/api/products/${productId}/reviews/summarize`,
      );

      setSummary(data.summary);
    } catch (error) {
      console.log(error);
      setSummaryError("Could not summarize the reviews.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (error) {
    return <p className="text-red-500">Could not fetch reviews. Try Again!</p>;
  }

  if (!reviewData?.reviews.length) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((placeholder) => (
          <ReviewSkeleton key={placeholder} />
        ))}
      </div>
    );
  }

  const currentSummary = reviewData.summary || summary;
  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={handleSummarize}
              className="cursor-pointer"
              disabled={isSummaryLoading}
            >
              <HiSparkles />
              Summarize
            </Button>
            {isSummaryLoading && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryError && <p className="text-red-500">{summaryError}</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewData?.reviews.map((review) => (
          <div key={review.id}>
            <div>{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <div>{review.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
