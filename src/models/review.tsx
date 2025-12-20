// import mongoose from "mongoose";

// const ReviewSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//     rating: { type: Number, min: 1, max: 5 },
//     comment: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);

// models/Review.ts
import mongoose, { Schema, Document, models, model } from "mongoose";
import { updateProductRatings } from "./reviewHelper";

// Define interfaces for better type safety
export interface IReviewImage {
  url: string;
  alt: string;
  order: number;
}
export type TObjectId = mongoose.Types.ObjectId;

export interface IReviewReply {
  author: TObjectId;
  authorType: "admin" | "vendor" | "user";
  content: string;
  createdAt: Date;
  isEdited: boolean;
  editedAt?: Date;
}

export interface IReviewAspects {
  quality: number;
  value: number;
  shipping: number;
  service: number;
}

export interface IReviewHelpfulness {
  helpful: number;
  notHelpful: number;
  totalVotes: number;
  helpfulnessRatio: number;
}

export interface IReviewMethods {
  calculateQualityScore(): number;
  addHelpfulVote(
    userId: TObjectId,
    voteType: "helpful" | "not_helpful"
  ): Promise<void>;
  addReply(
    authorId: TObjectId,
    content: string,
    authorType?: "admin" | "vendor" | "user"
  ): Promise<void>;
}

export interface IProductRatingStats {
  averageRating: number | null;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface IReviewStatics {
  getProductRatingStats(productId: TObjectId): Promise<IProductRatingStats>;
}

export interface IHelpfulVotes {
  userId: TObjectId;
  vote: "helpful" | "not_helpful";
  votedAt: Date;
}

const HelpfulVotesSchema = new Schema<IHelpfulVotes>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  vote: { type: String, enum: ["helpful", "not_helpful"] },
  votedAt: { type: Date, default: Date.now },
});

const ReviewImageSchema = new Schema<IReviewImage>({
  url: { type: String, required: true },
  alt: { type: String, default: "Review image" },
  order: { type: Number, default: 0 },
});

const ReviewReplySchema = new Schema<IReviewReply>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorType: {
    type: String,
    enum: ["admin", "vendor", "user"],
    default: "user",
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  createdAt: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
});

const ReviewAspectsSchema = new Schema<IReviewAspects>({
  quality: { type: Number, min: 1, max: 5 },
  value: { type: Number, min: 1, max: 5 },
  shipping: { type: Number, min: 1, max: 5 },
  service: { type: Number, min: 1, max: 5 },
});

const ReviewHelpfulnessSchema = new Schema<IReviewHelpfulness>({
  helpful: { type: Number, default: 0, min: 0 },
  notHelpful: { type: Number, default: 0, min: 0 },
  totalVotes: { type: Number, default: 0, min: 0 },
  helpfulnessRatio: { type: Number, default: 0, min: 0, max: 1 },
});

const ReviewSchema = new Schema(
  {
    // Core Review Data
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    // Review Content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 250,
    },
    // Detailed Ratings (optional aspect-based ratings)
    aspects: ReviewAspectsSchema,

    // Media
    images: [ReviewImageSchema],
    videos: [
      {
        url: String,
        thumbnail: String,
        duration: Number, // in seconds
      },
    ],

    // Review Verification
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },
    purchaseOrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    // Review Status and Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged", "spam"],
      default: "pending",
      index: true,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    moderatedAt: { type: Date },
    moderationReason: { type: String },

    // Helpfulness Tracking
    helpfulness: {
      type: ReviewHelpfulnessSchema,
      default: () => ({}),
    },

    // User Interactions
    helpfulVotes: [
      // {
      //   user: { type: Schema.Types.ObjectId, ref: "User" },
      //   vote: { type: String, enum: ["helpful", "not_helpful"] },
      //   votedAt: { type: Date, default: Date.now },
      // },
      HelpfulVotesSchema,
    ],

    // Replies and Responses
    replies: [ReviewReplySchema],

    // Review Analytics
    analytics: {
      viewCount: { type: Number, default: 0 },
      reportCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 },
    },

    // Review Context
    variant: {
      size: String,
      color: String,
      style: String,
      // Add other variant properties as needed
    },

    // Purchase Context
    purchasePrice: { type: Number },
    purchaseDate: { type: Date },
    usageDuration: {
      type: String,
      enum: [
        "less_than_week",
        "week_to_month",
        "month_to_6months",
        "more_than_6months",
      ],
    },

    // Review Quality Indicators
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isIncentivized: { type: Boolean, default: false }, // For incentivized reviews

    // Spam and Fraud Detection
    spamScore: { type: Number, min: 0, max: 1, default: 0 },
    ipAddress: { type: String },
    userAgent: { type: String },

    // Location (optional)
    location: {
      country: String,
      state: String,
      city: String,
    },

    // Review Source
    source: {
      type: String,
      enum: ["website", "mobile_app", "email_campaign", "third_party"],
      default: "website",
    },

    // Edit History
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    editHistory: [
      {
        editedAt: { type: Date, default: Date.now },
        previousRating: Number,
        previousComment: String,
        reason: String,
      },
    ],

    // Admin Notes (internal use)
    adminNotes: [
      {
        note: String,
        addedBy: { type: Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields
ReviewSchema.virtual("averageAspectRating").get(function () {
  if (!this.aspects) return this.rating;

  const aspects = this.aspects;
  const ratings = [
    aspects.quality,
    aspects.value,
    aspects.shipping,
    aspects.service,
  ].filter(Boolean);

  if (ratings.length === 0) return this.rating;

  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

ReviewSchema.virtual("helpfulnessPercentage").get(function () {
  const total = this.helpfulness.totalVotes;
  if (total === 0) return 0;
  return Math.round((this.helpfulness.helpful / total) * 100);
});

ReviewSchema.virtual("timeFromPurchase").get(function () {
  if (!this.purchaseDate) return null;

  const diffTime = Math.abs(
    this.createdAt.getTime() - this.purchaseDate.getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
});

ReviewSchema.virtual("reviewAge").get(function () {
  const diffTime = Math.abs(new Date().getTime() - this.createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
});

// Indexes for better performance
ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ user: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1, createdAt: -1 });
ReviewSchema.index({ isVerifiedPurchase: 1, status: 1 });
ReviewSchema.index({ "helpfulness.helpful": -1 });
ReviewSchema.index({ qualityScore: -1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ comment: "text", title: "text" });

// Compound indexes
ReviewSchema.index({ productId: 1, rating: -1, createdAt: -1 });
ReviewSchema.index({ productId: 1, isVerifiedPurchase: 1, status: 1 });

// Pre-save middleware
ReviewSchema.pre<ReviewDocument>("save", function (next) {
  // Calculate quality score based on various factors
  this.calculateQualityScore();

  // Update helpfulness ratio
  if (this.helpfulness.totalVotes > 0) {
    this.helpfulness.helpfulnessRatio =
      this.helpfulness.helpful / this.helpfulness.totalVotes;
  }

  next();
});

// Post-save middleware to update product ratings
ReviewSchema.post("save", async function (doc) {
  try {
    await updateProductRatings(doc.productId);
  } catch (error) {
    console.error("Error updating product ratings:", error);
  }
});

ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc) {
    try {
      await updateProductRatings(doc.productId);
    } catch (error) {
      console.error("Error updating product ratings after deletion:", error);
    }
  }
);

// Methods
ReviewSchema.methods.calculateQualityScore = function () {
  let score = 50; // Base score

  // Length bonus
  if (this.comment.length > 100) score += 10;
  if (this.comment.length > 300) score += 10;

  // Image bonus
  if (this.images && this.images.length > 0) score += 15;

  // Verified purchase bonus
  if (this.isVerifiedPurchase) score += 20;

  // Aspect ratings bonus
  if (this.aspects && Object.keys(this.aspects.toObject()).length > 0)
    score += 10;

  // Title bonus
  if (this.title && this.title.length > 10) score += 5;

  // Helpfulness bonus (if review has been helpful to others)
  if (
    this.helpfulness.totalVotes > 5 &&
    this.helpfulness.helpfulnessRatio > 0.7
  ) {
    score += 15;
  }

  // Penalize very short reviews
  if (this.comment.length < 50) score -= 20;

  // Ensure score is within bounds
  this.qualityScore = Math.max(0, Math.min(100, score));

  return this.qualityScore;
};

ReviewSchema.methods.addHelpfulVote = function (
  userId: TObjectId,
  voteType: "helpful" | "not_helpful"
) {
  // Remove existing vote from this user
  this.helpfulVotes = this.helpfulVotes.filter(
    (vote: IHelpfulVotes) => vote.userId !== userId
  );

  // Add new vote
  this.helpfulVotes.push({
    userId: userId,
    vote: voteType,
    votedAt: new Date(),
  });

  // Update helpfulness counters
  const helpfulCount = this.helpfulVotes.filter(
    (vote: IHelpfulVotes) => vote.vote === "helpful"
  ).length;
  const notHelpfulCount = this.helpfulVotes.filter(
    (vote: IHelpfulVotes) => vote.vote === "not_helpful"
  ).length;

  this.helpfulness.helpful = helpfulCount;
  this.helpfulness.notHelpful = notHelpfulCount;
  this.helpfulness.totalVotes = helpfulCount + notHelpfulCount;

  return this.save();
};

ReviewSchema.methods.addReply = function (
  authorId: TObjectId,
  content: string,
  authorType: "admin" | "vendor" | "user" = "user"
) {
  this.replies.push({
    author: authorId,
    authorType,
    content,
    createdAt: new Date(),
    isEdited: false,
  });

  return this.save();
};

// Static methods
ReviewSchema.statics.getProductRatingStats = async function (
  productId: TObjectId
): Promise<IProductRatingStats> {
  const stats = await this.aggregate([
    {
      $match: {
        productId: productId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
    {
      $project: {
        averageRating: { $round: ["$averageRating", 1] },
        totalReviews: 1,
        ratingDistribution: {
          5: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 5] },
              },
            },
          },
          4: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 4] },
              },
            },
          },
          3: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 3] },
              },
            },
          },
          2: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 2] },
              },
            },
          },
          1: {
            $size: {
              $filter: {
                input: "$ratingDistribution",
                cond: { $eq: ["$$this", 1] },
              },
            },
          },
        },
      },
    },
  ]);

  if (!stats[0]) {
    return {
      averageRating: null,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
  return stats[0];
};

export type IReviewType = mongoose.InferSchemaType<typeof ReviewSchema>;
export type ReviewDocument = mongoose.HydratedDocument<
  IReviewType,
  IReviewMethods
>;

export const Review =
  (mongoose.models.Review as mongoose.Model<ReviewDocument, IReviewStatics>) ||
  mongoose.model<ReviewDocument, IReviewStatics>("Review", ReviewSchema);

export default Review;
