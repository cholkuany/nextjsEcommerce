import mongoose from "mongoose";
import Product from "./product";
import Review from "./review";
import { ReviewDocument } from "./review";

export interface IDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}
const DEFAULTDISTRIBUTION = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};
// Helper function that does the real work
export async function updateProductRatings(productId: mongoose.Types.ObjectId) {
  // THIS IS WHERE THE ACTUAL AVERAGING HAPPENS
  const stats = await Review.aggregate([
    {
      $match: {
        product: productId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        // REAL AVERAGE CALCULATION FROM MULTIPLE REVIEWS
        averageRating: { $avg: "$rating" }, // 🔥 This calculates the average
        totalReviews: { $sum: 1 },
        allRatings: { $push: "$rating" },
      },
    },
  ]);

  if (stats.length === 0) {
    // No reviews - set to defaults
    await ratingDBUtil(productId, 0, 0, DEFAULTDISTRIBUTION);
    return;
  }

  const { averageRating, totalReviews, allRatings } = stats[0];

  // Calculate distribution
  const distribution = {
    5: allRatings.filter((r: number) => r === 5).length,
    4: allRatings.filter((r: number) => r === 4).length,
    3: allRatings.filter((r: number) => r === 3).length,
    2: allRatings.filter((r: number) => r === 2).length,
    1: allRatings.filter((r: number) => r === 1).length,
  };

  // NOW the averageRating setter kicks in to format it
  await ratingDBUtil(productId, averageRating, totalReviews, distribution);
}

export async function ratingDBUtil(
  productId: mongoose.Types.ObjectId,
  averageRating: number,
  totalReviews: number,
  distribution: IDistribution
) {
  await Product.findByIdAndUpdate(productId, {
    "reviews.averageRating": averageRating, // 🔥 Setter rounds this to 1 decimal
    "reviews.totalReviews": totalReviews,
    "reviews.ratingDistribution": distribution,
  });
}
