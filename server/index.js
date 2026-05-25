import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase, isDatabaseConnected } from "./db.js";
import { Review } from "./models/Review.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const model = process.env.MISTRAL_MODEL || "mistral-large-latest";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

await connectDatabase();

const reviewPrompt = ({ language, code, focus }) => `
You are a senior automated code reviewer. Review the submitted code with practical, production-minded feedback.

Context:
- The user is building software and needs actionable review comments.
- The code language/framework is: ${language || "not specified"}.
- Review focus: ${focus || "correctness, security, performance, readability, maintainability, and tests"}.

Constraints:
- Do not rewrite the whole code unless a small replacement snippet is necessary.
- Prioritize real bugs and risks over style preferences.
- Keep comments short, specific, and tied to concrete code behavior.
- If the code is incomplete, state assumptions clearly.
- Never expose secrets or recommend hard-coding API keys.

Expected output:
Return valid JSON only with this shape:
{
  "summary": "short overall assessment",
  "score": 0-100,
  "securityScore": 0-100,
  "performanceScore": 0-100,
  "maintainabilityScore": 0-100,
  "riskLevel": "Low Risk|Medium Risk|High Risk",
  "deploymentReadiness": "Ready|Needs Improvement|Not Ready",
  "status": "Excellent|Good|Fair|Needs Improvement|Critical Issues Detected",
  "verdict": "Ready for Production|Needs Improvement|Not Ready for Production",
  "issueCounts": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "issues": [
    {
      "severity": "critical|high|medium|low",
      "title": "short issue title",
      "details": "why this matters",
      "suggestion": "specific fix"
    }
  ],
  "strengths": ["what is good"],
  "nextSteps": ["highest value improvements"]
}

Scoring guidelines:
- 90-100 = Excellent
- 75-89 = Good
- 60-74 = Fair
- 40-59 = Needs Improvement
- 0-39 = Critical Issues Detected

Calculate scores based on:
- Security vulnerabilities
- Performance bottlenecks
- Code readability
- Maintainability
- Error handling
- Best practices
- Code complexity

Risk level:
- Low Risk for strong scores and no critical/high issues
- Medium Risk for moderate issues or fair scores
- High Risk for critical/high security or correctness issues

Deployment readiness:
- Ready only when the code is production-safe
- Needs Improvement when issues should be fixed before release
- Not Ready when critical or high-risk issues exist

Code:
\`\`\`${language || ""}
${code}
\`\`\`
`;

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model, database: isDatabaseConnected() ? "connected" : "not configured" });
});

app.get("/api/reviews", async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json([]);
  }

  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(25)
    .select("language framework summary score securityScore performanceScore maintainabilityScore riskLevel deploymentReadiness status verdict issueCounts createdAt");

  res.json(reviews);
});

app.post("/api/review", async (req, res) => {
  const { code, language, framework, focus } = req.body || {};

  if (!process.env.MISTRAL_API_KEY) {
    return res.status(500).json({ error: "Missing MISTRAL_API_KEY in .env" });
  }

  if (!code || code.trim().length < 10) {
    return res.status(400).json({ error: "Please paste at least 10 characters of code." });
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "You return strict JSON for code review results."
          },
          {
            role: "user",
            content: reviewPrompt({ language: framework ? `${language} / ${framework}` : language, code, focus })
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || data?.error?.message || "Mistral API request failed."
      });
    }

    const content = data?.choices?.[0]?.message?.content || "";
    const parsed = extractJson(content);

    if (!parsed) {
      return res.json({
        summary: content || "The review completed, but the response was not JSON.",
        score: null,
        issues: [],
        strengths: [],
        nextSteps: ["Try again with a smaller code sample."]
      });
    }

    if (isDatabaseConnected()) {
      await Review.create({
        ...parsed,
        language,
        framework,
        focus,
        codePreview: code.slice(0, 1200)
      });
    }

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected server error." });
  }
});

app.listen(port, () => {
  console.log(`Code reviewer backend running on http://localhost:${port}`);
});
