import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    severity: String,
    title: String,
    details: String,
    suggestion: String
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    language: String,
    framework: String,
    focus: String,
    codePreview: String,
    summary: String,
    score: Number,
    securityScore: Number,
    performanceScore: Number,
    maintainabilityScore: Number,
    riskLevel: String,
    deploymentReadiness: String,
    status: String,
    verdict: String,
    issueCounts: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 }
    },
    issues: [issueSchema],
    strengths: [String],
    nextSteps: [String]
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
