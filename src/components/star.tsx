import { Star } from "lucide-react";
export const getStars = (rating: number) =>
  [...Array(5)].map((_, idx) => (
    <Star
      key={idx}
      className={`w-3 h-3 ${
        idx < Math.round(rating)
          ? "text-yellow-400 fill-current"
          : "text-gray-300"
      }`}
    />
  ));
