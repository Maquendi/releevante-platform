import { Star } from "lucide-react";

const Rating = ({ rating }: { rating: number }) => {
  const ratingArr = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <div className="flex gap-0.5">
      {ratingArr.map((isFilled, index) => (
        <Star
          key={index}
          className={isFilled ? "text-primary" : "text-gray-300"}
          fill="currentColor"
          strokeWidth={isFilled ? 1 : 1.5}
          size={12}
        />
      ))}
    </div>
  );
};

export default Rating;
