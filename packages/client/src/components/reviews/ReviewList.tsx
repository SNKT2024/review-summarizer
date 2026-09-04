import { StarRating } from "./StarRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { HiSparkles } from "react-icons/hi";
import { ReviewSkeleton } from "./ReviewSkeleton";
import {
  reviewsApi,
  type GetReviewsResponse,
  type SummarizeResponse,
} from "./reviewApi";
type Props = {
  productId: number;
};

export const ReviewList = ({ productId }: Props) => {
  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });
  const reviewsQuery = useQuery<GetReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  if (reviewsQuery.isError) {
    return <p className="text-red-500">Could not fetch reviews. Try Again!</p>;
  }

  if (reviewsQuery.isPending) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((placeholder) => (
          <ReviewSkeleton key={placeholder} />
        ))}
      </div>
    );
  }

  if (!reviewsQuery.data.reviews.length) {
    return null;
  }

  const currentSummary =
    reviewsQuery.data.summary || summaryMutation?.data?.summary;
  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => summaryMutation.mutate()}
              className="cursor-pointer"
              disabled={summaryMutation.isPending}
            >
              <HiSparkles />
              Summarize
            </Button>
            {summaryMutation.isPending && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryMutation.isError && (
              <p className="text-red-500">
                Could not summarize reviews. Try again.{" "}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewsQuery.data?.reviews.map((review) => (
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
