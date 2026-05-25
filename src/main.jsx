import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  CreditCard,
  Eye,
  EyeOff,
  FileClock,
  Github,
  History,
  Home,
  Lock,
  LogIn,
  Mail,
  PanelLeft,
  Settings,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Users
} from "lucide-react";
import "./styles.css";

const sampleCode = `function total(items) {
  let sum = 0
  for (let i = 0; i <= items.length; i++) {
    sum += items[i].price
  }
  return sum
}`;

function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const goDashboard = () => setPage(user ? "dashboard" : "login");

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage("landing")} aria-label="Home">
          <span className="brand-mark">
            <ScanSearch size={21} />
          </span>
          <span>CodeReview AI</span>
        </button>
        <nav className="nav-actions" aria-label="Main navigation">
          <button onClick={() => setPage("landing")}>Home</button>
          <button onClick={goDashboard}>Reviewer</button>
          {user ? (
            <button className="primary tiny" onClick={() => setUser(null)}>
              Sign out
            </button>
          ) : (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button className="primary tiny" onClick={() => setPage("signup")}>
                Sign up
              </button>
            </>
          )}
        </nav>
      </header>

      {page === "landing" && <Landing onStart={goDashboard} />}
      {page === "login" && <Auth mode="login" setMode={setPage} setUser={setUser} />}
      {page === "signup" && <Auth mode="signup" setMode={setPage} setUser={setUser} />}
      {page === "dashboard" && <Dashboard user={user} />}
    </div>
  );
}

function Landing({ onStart }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={16} /> AI-powered automated review
          </p>
          <h1>AI CodeReviewer</h1>
          <p className="hero-text">
            Paste code, select a language, and get prioritized review notes for bugs,
            security risks, maintainability, performance, and test gaps.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onStart}>
              Start reviewing <ArrowRight size={18} />
            </button>
            <a className="secondary" href="#features">
              View features
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Review preview">
          <div className="window-controls">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <pre>{sampleCode}</pre>
          <div className="review-chip high">High: loop reads one item past the array end.</div>
          <div className="review-chip medium">Medium: missing validation for item shape.</div>
        </div>
      </section>

      <section className="feature-band" id="features">
        <Feature icon={<ShieldCheck />} title="Risk-first feedback" text="Finds correctness and security problems before style comments." />
        <Feature icon={<Code2 />} title="Multi-language input" text="Works with pasted snippets from common app stacks." />
        <Feature icon={<CheckCircle2 />} title="Structured results" text="Returns score, issues, strengths, and next steps." />
      </section>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <article className="feature-card">
      <span>{icon}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

function Auth({ mode, setMode, setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isSignup = mode === "signup";

  const submit = (event) => {
    event.preventDefault();
    setUser({ name: form.name || form.email.split("@")[0] || "Reviewer" });
    setMode("dashboard");
  };

  return (
    <main className="auth-page">
      <section className="auth-copy">
        <p className="eyebrow">
          <Lock size={16} /> Secure workspace
        </p>
        <h1>{isSignup ? "Create your reviewer account" : "Welcome back"}</h1>
        <p>
          Use the demo login flow to enter the code review workspace. Production
          authentication can be connected later through your preferred identity provider.
        </p>
      </section>
      <form className="auth-form" onSubmit={submit}>
        <h2>{isSignup ? "Sign up" : "Login"}</h2>
        {isSignup && (
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Your name"
              required
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Password
          <span className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="At least 8 characters"
              minLength="8"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="primary full" type="submit">
          {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
          {isSignup ? "Create account" : "Login"}
        </button>
        <button className="github-button" type="button">
          <Github size={18} /> Continue with GitHub
        </button>
        <p className="switch-auth">
          {isSignup ? "Already have an account?" : "New here?"}
          <button type="button" onClick={() => setMode(isSignup ? "login" : "signup")}>
            {isSignup ? "Login" : "Create account"}
          </button>
        </p>
      </form>
    </main>
  );
}

function Dashboard({ user }) {
  const [activePage, setActivePage] = useState("overview");
  const [toast, setToast] = useState("");
  const [repository, setRepository] = useState("");
  const [connectedRepo, setConnectedRepo] = useState("");
  const [historyItems, setHistoryItems] = useState([
    ["Checkout validation", "JavaScript", "Score 82", "Today"],
    ["Auth middleware", "Node.js", "Score 91", "Yesterday"],
    ["Invoice parser", "Python", "Score 76", "May 20"]
  ]);
  const [settings, setSettings] = useState({
    theme: "Light",
    model: "mistral-large-latest",
    securityFirst: true,
    performanceReview: true,
    maintainabilityReview: true,
    lineByLine: true
  });
  const [integrations, setIntegrations] = useState({
    mistralKey: "Configured in backend .env",
    github: "",
    sonarqube: ""
  });
  const [support, setSupport] = useState({ name: user?.name || "", email: "", message: "" });
  const [code, setCode] = useState(sampleCode);
  const [language, setLanguage] = useState("javascript");
  const [framework, setFramework] = useState("React");
  const [focus, setFocus] = useState("security, performance, maintainability, bugs, best practices");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const groupedIssues = useMemo(() => review?.issues || [], [review]);
  const issueCounts = getIssueCounts(review);
  const score = review?.score ?? 0;
  const scoreCards = [
    ["Overall code score", review ? score : "--"],
    ["Security score", review ? review.securityScore ?? Math.max(0, score - 8) : "--"],
    ["Performance score", review ? review.performanceScore ?? Math.max(0, score - 3) : "--"],
    ["Maintainability score", review ? review.maintainabilityScore ?? Math.min(100, score + 4) : "--"]
  ];

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("http://localhost:5000/api/reviews");
        const data = await response.json();
        if (!Array.isArray(data) || !data.length) return;

        setHistoryItems(data.map((item) => [
          item.framework ? `${item.framework} review` : `${item.language || "Code"} review`,
          item.language || "Unknown",
          `Score ${item.score ?? "N/A"}`,
          new Date(item.createdAt).toLocaleDateString()
        ]));
      } catch {
        // History stays local when the backend or MongoDB is unavailable.
      }
    }

    loadHistory();
  }, []);

  const runReview = async () => {
    setLoading(true);
    setError("");
    setReview(null);

    try {
      const response = await fetch("http://localhost:5000/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, framework, focus })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Review failed.");
      }

      setReview(data);
      setHistoryItems([[`${framework || language} review`, language, `Score ${data.score ?? "N/A"}`, "Just now"], ...historyItems]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const downloadText = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    notify(`${filename} downloaded.`);
  };

  const pages = {
    overview: (
      <OverviewPage
        user={user}
        review={review}
        historyItems={historyItems}
        scoreCards={scoreCards}
        setActivePage={setActivePage}
      />
    ),
    review: (
      <CodeInputPage
        code={code}
        setCode={setCode}
        language={language}
        setLanguage={setLanguage}
        framework={framework}
        setFramework={setFramework}
        focus={focus}
        setFocus={setFocus}
        loading={loading}
        runReview={runReview}
        user={user}
        notify={notify}
      />
    ),
    results: <ReviewResultsPage review={review} error={error} scoreCards={scoreCards} groupedIssues={groupedIssues} issueCounts={issueCounts} />,
    repository: <RepositoryPage repository={repository} setRepository={setRepository} connectedRepo={connectedRepo} setConnectedRepo={setConnectedRepo} notify={notify} />,
    exports: <ExportPage review={review} scoreCards={scoreCards} downloadText={downloadText} notify={notify} />,
    integrations: <IntegrationsPage integrations={integrations} setIntegrations={setIntegrations} notify={notify} />,
    history: <HistoryPage historyItems={historyItems} />,
    settings: <SettingsPage settings={settings} setSettings={setSettings} />,
    support: <SupportPage support={support} setSupport={setSupport} notify={notify} />
  };

  return (
    <main className="dashboard-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <section className="dashboard-content">{pages[activePage]}</section>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "review", label: "New Review", icon: Code2 },
  { id: "results", label: "Results", icon: ShieldCheck },
  { id: "repository", label: "Repository", icon: Github },
  { id: "exports", label: "Exports", icon: FileClock },
  { id: "integrations", label: "Integrations", icon: Lock },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: Mail }
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <PanelLeft size={18} />
        <span>Workspace</span>
      </div>
      <nav className="sidebar-nav" aria-label="Workspace pages">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function CodeInputPage(props) {
  const {
    code,
    setCode,
    language,
    setLanguage,
    framework,
    setFramework,
    focus,
    setFocus,
    loading,
    runReview,
    user,
    notify
  } = props;
  const [inputMode, setInputMode] = useState("write");

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCode(text);
    notify(`${file.name} uploaded.`);
  };

  return (
    <div className="dashboard">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">
            <Mail size={16} /> {user?.name || "Guest"} workspace
          </p>
          <h1>Automated code reviewer</h1>
        </div>
        <button className="primary" onClick={runReview} disabled={loading}>
          <ScanSearch size={18} />
          {loading ? "Reviewing..." : "Run review"}
        </button>
      </section>

      <section className="review-layout">
        <div className="editor-pane">
          <div className="mode-tabs" role="tablist" aria-label="Code input method">
            <button className={inputMode === "write" ? "active" : ""} onClick={() => setInputMode("write")}>
              <Code2 size={18} />
              Write or paste code
            </button>
            <button className={inputMode === "upload" ? "active" : ""} onClick={() => setInputMode("upload")}>
              <FileClock size={18} />
              Upload code file
            </button>
          </div>

          {inputMode === "upload" && (
            <div className="upload-box">
              <div>
                <strong>Upload code/file</strong>
                <p>Choose a source file and its content will appear in the editor below.</p>
              </div>
              <input type="file" accept=".js,.jsx,.ts,.tsx,.py,.java,.cs,.php,.txt" onChange={uploadFile} />
            </div>
          )}

          <div className="input-row">
            <label>
              Language
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
              </select>
            </label>
            <label>
              Framework
              <input value={framework} onChange={(event) => setFramework(event.target.value)} placeholder="React, Express, Django..." />
            </label>
            <label>
              Focus
              <input value={focus} onChange={(event) => setFocus(event.target.value)} />
            </label>
          </div>
          <label className="code-label">
            {inputMode === "upload" ? "Uploaded code" : "Write or paste source code"}
            <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck="false" />
          </label>
        </div>

        <aside className="results-pane">
          <div className="empty-state">
            <Code2 size={36} />
            <h2>Paste source code</h2>
            <p>Select the language/framework, then run the review. Results appear in the Review Results pages.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function PageHeader({ icon, eyebrow, title, action }) {
  return (
    <section className="page-header">
      <div>
        <p className="eyebrow">
          {icon} {eyebrow}
        </p>
        <h1>{title}</h1>
      </div>
      {action}
    </section>
  );
}

function OverviewPage({ user, review, historyItems, scoreCards, setActivePage }) {
  return (
    <div className="dashboard">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">
            <Home size={16} /> {user?.name || "Guest"} dashboard
          </p>
          <h1>Code review workspace</h1>
        </div>
        <button className="primary" onClick={() => setActivePage("review")}>
          <Code2 size={18} />
          New review
        </button>
      </section>

      <section className="stats-grid">
        {scoreCards.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
      </section>

      <section className="cards-grid">
        <ActionCard title="Review code" text="Paste code or upload a source file, then run a Mistral-powered review." action="Open reviewer" onClick={() => setActivePage("review")} />
        <ActionCard title="Connect repository" text="Prepare a GitHub repository for scanning and future pull request checks." action="Open repository" onClick={() => setActivePage("repository")} />
        <ActionCard title="Export report" text="Download JSON, CSV, or print a PDF-style report from the latest review." action="Open exports" onClick={() => setActivePage("exports")} />
      </section>

      <div className="report-panel top-gap">
        <h2>Latest review</h2>
        <p>{review?.summary || "No review has been run yet. Start with New Review to generate scores, findings, and exportable results."}</p>
      </div>

      <div className="table-card top-gap">
        {historyItems.slice(0, 3).map(([name, stack, status, date]) => (
          <div className="table-row" key={`${name}-${date}`}>
            <strong>{name}</strong>
            <span>{stack}</span>
            <span>{status}</span>
            <span>{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RepositoryPage({ repository, setRepository, connectedRepo, setConnectedRepo, notify }) {
  const connectRepo = () => {
    setConnectedRepo(repository || "https://github.com/example/repository");
    notify("GitHub repository connected.");
  };

  return (
    <div className="dashboard">
      <PageHeader icon={<Github size={16} />} eyebrow="Repository Analyzer" title="Connect GitHub repository" />
      <section className="settings-form">
        <label>
          Repository URL
          <input value={repository} onChange={(event) => setRepository(event.target.value)} placeholder="https://github.com/user/repo" />
        </label>
        <button className="primary" type="button" onClick={connectRepo}>Connect repository</button>
      </section>
      <section className="cards-grid top-gap">
        <InfoCard title="Repository scanning" meta={connectedRepo ? "Connected" : "Waiting"} text={connectedRepo || "Connect a GitHub repository to prepare branch and file scanning."} />
        <InfoCard title="Branch checks" meta="Ready" text="Scan pull requests, changed files, or full repositories from this workspace." />
        <InfoCard title="Dependency review" meta="Planned" text="Flag vulnerable packages and outdated project configuration." />
      </section>
    </div>
  );
}

function ReviewResultsPage({ review, error, scoreCards, groupedIssues, issueCounts }) {
  const status = review ? review.status || getScoreStatus(review.score) : "Run a review";
  const riskLevel = review ? review.riskLevel || getRiskLevel(review.score, issueCounts) : "--";
  const readiness = review ? review.deploymentReadiness || getReadiness(issueCounts, review.score) : "--";
  const verdict = review ? review.verdict || getVerdict(readiness) : "--";

  return (
    <div className="dashboard">
      <PageHeader icon={<ShieldCheck size={16} />} eyebrow="Review Results" title="Code scoring dashboard" />
      {error && <div className="error-box">{error}</div>}
      <section className="stats-grid">
        {scoreCards.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
      </section>
      {review ? (
        <div className="report-panel">
          <section className="dashboard-report">
            <h2>Code Scoring Dashboard</h2>
            <div className="result-lines">
              <p><strong>Overall Code Score:</strong> {scoreCards[0][1]}/100</p>
              <p><strong>Security Score:</strong> {scoreCards[1][1]}/100</p>
              <p><strong>Performance Score:</strong> {scoreCards[2][1]}/100</p>
              <p><strong>Maintainability Score:</strong> {scoreCards[3][1]}/100</p>
              <p><strong>Risk Level:</strong> {riskBadge(riskLevel)} {riskLevel}</p>
              <p><strong>Deployment Readiness:</strong> {readinessBadge(readiness)} {readiness}</p>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Verdict:</strong> {verdict}</p>
            </div>
            <div className="issue-count-grid">
              <Stat label="Critical" value={issueCounts.critical} />
              <Stat label="High" value={issueCounts.high} />
              <Stat label="Medium" value={issueCounts.medium} />
              <Stat label="Low" value={issueCounts.low} />
            </div>
          </section>
          <h2>Overall summary</h2>
          <p>{review.summary}</p>
          <h2>Line-by-line issues</h2>
          <div className="issue-list">
            {groupedIssues.length ? groupedIssues.map((issue, index) => <Issue key={`${issue.title}-${index}`} issue={issue} />) : <p className="muted">No issues returned.</p>}
          </div>
          <ResultList title="Strengths" items={review.strengths} />
          <ResultList title="Next steps" items={review.nextSteps} />
        </div>
      ) : (
        <EmptyPanel title="No review yet" text="Run a review from the Code Review page to populate scores and findings." />
      )}
    </div>
  );
}

function BugReportPage({ groupedIssues }) {
  const errors = groupedIssues.filter((issue) => ["critical", "high"].includes(issue.severity));
  const warnings = groupedIssues.filter((issue) => !["critical", "high"].includes(issue.severity));

  return (
    <div className="dashboard">
      <PageHeader icon={<ScanSearch size={16} />} eyebrow="Bug Detection Report" title="Errors, warnings, and line issues" />
      <section className="cards-grid">
        <InfoCard title={`${errors.length} Errors`} meta="Critical and high" text="Issues that can break behavior, security, or production stability." />
        <InfoCard title={`${warnings.length} Warnings`} meta="Medium and low" text="Issues that should be improved before the code grows." />
        <InfoCard title={`${groupedIssues.length} Line-by-line issues`} meta="AI findings" text="Review comments are tied to concrete behavior and recommended fixes." />
      </section>
      <div className="issue-list top-gap">
        {groupedIssues.length ? groupedIssues.map((issue, index) => <Issue key={`${issue.title}-${index}`} issue={issue} />) : <EmptyPanel title="No bug report yet" text="Run a review to generate errors, warnings, and line-by-line findings." />}
      </div>
    </div>
  );
}

function PerformancePage({ review }) {
  return (
    <div className="dashboard">
      <PageHeader icon={<Sparkles size={16} />} eyebrow="Performance Analysis" title="Bottlenecks and optimization suggestions" />
      <section className="cards-grid">
        <InfoCard title="Bottlenecks" meta="Detection" text={review ? "Check issue details for loops, repeated work, slow rendering, and avoidable network calls." : "Run a review to detect bottlenecks."} />
        <InfoCard title="Optimization suggestions" meta="Actionable" text="Recommendations focus on lower complexity, fewer repeated operations, and leaner rendering." />
        <InfoCard title="Performance score" meta="Metric" text={review ? `Estimated score: ${Math.max(0, review.score - 3)}` : "Waiting for review results."} />
      </section>
    </div>
  );
}

function QualityPage({ review }) {
  return (
    <div className="dashboard">
      <PageHeader icon={<BookOpenCheck size={16} />} eyebrow="Code Quality Insights" title="Smells, best practices, and metrics" />
      <section className="cards-grid">
        <InfoCard title="Code smells" meta="Maintainability" text="Looks for duplication, unclear naming, large functions, and brittle logic." />
        <InfoCard title="Best practices" meta="Guidance" text={review?.strengths?.[0] || "Run a review to identify strengths and best-practice gaps."} />
        <InfoCard title="Maintainability metrics" meta="Score" text={review ? `Estimated maintainability: ${Math.min(100, review.score + 4)}` : "Waiting for review results."} />
      </section>
    </div>
  );
}

function RefactorPage({ code }) {
  return (
    <div className="dashboard">
      <PageHeader icon={<CheckCircle2 size={16} />} eyebrow="Refactored Code Suggestions" title="Improved snippets and before vs after" />
      <section className="compare-grid">
        <div className="editor-pane">
          <h2>Before</h2>
          <pre>{code}</pre>
        </div>
        <div className="editor-pane">
          <h2>After</h2>
          <pre>{`// Suggested improvements appear here after review.\n// Keep validation explicit, reduce repeated work,\n// and add tests for edge cases.`}</pre>
        </div>
      </section>
    </div>
  );
}

function ExportPage({ review, scoreCards, downloadText, notify }) {
  const reportData = buildReportData(review, scoreCards);
  const json = JSON.stringify(reportData, null, 2);
  const csv = review?.issues?.length
    ? [
        "section,label,value",
        ...reportData.scores.map((score) => `score,"${score.label}","${score.value}"`),
        ...review.issues.map((issue) => ["issue", issue.severity, issue.title, issue.details, issue.suggestion].map((value) => `"${String(value || "").replaceAll('"', '""')}"`).join(","))
      ].join("\n")
    : ["section,label,value", ...reportData.scores.map((score) => `score,"${score.label}","${score.value}"`)].join("\n");

  const printReport = () => {
    const reportWindow = window.open("", "_blank", "width=900,height=700");
    if (!reportWindow) {
      notify("Popup blocked. Allow popups to print PDF.");
      return;
    }

    reportWindow.document.write(renderReportHtml(reportData));
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  return (
    <div className="dashboard">
      <PageHeader icon={<FileClock size={16} />} eyebrow="Reports & Export" title="Download and share report" />
      <section className="stats-grid">
        {scoreCards.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
      </section>
      <div className="report-panel">
        <h2>Report preview</h2>
        <p>{reportData.summary}</p>
      </div>
      <section className="cards-grid">
        <ActionCard title="Download PDF" text="Includes scores, summary, issues, strengths, and next steps." action="Download PDF" onClick={printReport} />
        <ActionCard title="Download JSON" text="Export complete structured review results." action="Download JSON" onClick={() => downloadText("code-review-report.json", json, "application/json")} />
        <ActionCard title="Share report" text="Copy the score summary and main review note." action="Share report" onClick={() => { navigator.clipboard?.writeText(reportData.shareText); notify("Report summary copied."); }} />
      </section>
      <button className="secondary top-gap" onClick={() => downloadText("code-review-report.csv", csv, "text/csv")}>Download CSV</button>
    </div>
  );
}

function buildReportData(review, scoreCards) {
  const issueCounts = getIssueCounts(review);
  const readiness = review?.deploymentReadiness || getReadiness(issueCounts, review?.score);
  const riskLevel = review?.riskLevel || getRiskLevel(review?.score, issueCounts);
  const scores = scoreCards.map(([label, value]) => ({ label, value }));
  const summary = review?.summary || "No review has been generated yet. Run a code review first to include real scores and findings.";
  const issues = review?.issues || [];
  const strengths = review?.strengths || [];
  const nextSteps = review?.nextSteps || [];
  const status = review?.status || getScoreStatus(review?.score);
  const verdict = review?.verdict || getVerdict(readiness);
  const shareText = `Code Scoring Dashboard\n${scores.map((score) => `${score.label}: ${score.value}/100`).join("\n")}\nRisk Level: ${riskLevel}\nDeployment Readiness: ${readiness}\nStatus: ${status}\nVerdict: ${verdict}\nSummary: ${summary}`;

  return {
    generatedAt: new Date().toLocaleString(),
    summary,
    scores,
    riskLevel,
    deploymentReadiness: readiness,
    issueCounts,
    status,
    verdict,
    issues,
    strengths,
    nextSteps,
    shareText
  };
}

function renderReportHtml(report) {
  const escape = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

  const list = (items) => items.length ? items.map((item) => `<li>${escape(item)}</li>`).join("") : "<li>No data available.</li>";
  const issueRows = report.issues.length
    ? report.issues.map((issue) => `
      <tr>
        <td>${escape(issue.severity)}</td>
        <td>${escape(issue.title)}</td>
        <td>${escape(issue.details)}</td>
        <td>${escape(issue.suggestion)}</td>
      </tr>
    `).join("")
    : "<tr><td colspan=\"4\">No issues available.</td></tr>";

  return `
    <!doctype html>
    <html>
      <head>
        <title>Code Review Report</title>
        <style>
          body { color: #172026; font-family: Arial, sans-serif; margin: 32px; }
          h1 { margin-bottom: 4px; }
          .muted { color: #65716f; }
          .scores { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); margin: 24px 0; }
          .score { border: 1px solid #d8e1df; border-radius: 8px; padding: 14px; }
          .score span { color: #65716f; display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; }
          .score strong { color: #146a60; display: block; font-size: 28px; margin-top: 8px; }
          table { border-collapse: collapse; margin-top: 12px; width: 100%; }
          th, td { border: 1px solid #d8e1df; padding: 10px; text-align: left; vertical-align: top; }
          th { background: #eaf4f1; }
          section { margin-top: 28px; }
          @media print { body { margin: 18px; } .scores { grid-template-columns: repeat(2, 1fr); } }
        </style>
      </head>
      <body>
        <h1>Code Review Report</h1>
        <p class="muted">Generated: ${escape(report.generatedAt)}</p>
        <section class="scores">
          ${report.scores.map((score) => `<div class="score"><span>${escape(score.label)}</span><strong>${escape(score.value)}</strong></div>`).join("")}
        </section>
        <section>
          <h2>Risk and Readiness</h2>
          <p><strong>Risk Level:</strong> ${escape(report.riskLevel)}</p>
          <p><strong>Deployment Readiness:</strong> ${escape(report.deploymentReadiness)}</p>
          <p><strong>Status:</strong> ${escape(report.status)}</p>
          <p><strong>Verdict:</strong> ${escape(report.verdict)}</p>
        </section>
        <section>
          <h2>Issues Found</h2>
          <p>Critical: ${escape(report.issueCounts.critical)}</p>
          <p>High: ${escape(report.issueCounts.high)}</p>
          <p>Medium: ${escape(report.issueCounts.medium)}</p>
          <p>Low: ${escape(report.issueCounts.low)}</p>
        </section>
        <section>
          <h2>Summary</h2>
          <p>${escape(report.summary)}</p>
        </section>
        <section>
          <h2>Issues</h2>
          <table>
            <thead><tr><th>Severity</th><th>Title</th><th>Details</th><th>Suggestion</th></tr></thead>
            <tbody>${issueRows}</tbody>
          </table>
        </section>
        <section>
          <h2>Strengths</h2>
          <ul>${list(report.strengths)}</ul>
        </section>
        <section>
          <h2>Next Steps</h2>
          <ul>${list(report.nextSteps)}</ul>
        </section>
      </body>
    </html>
  `;
}

function getIssueCounts(review) {
  if (review?.issueCounts) {
    return {
      critical: review.issueCounts.critical || 0,
      high: review.issueCounts.high || 0,
      medium: review.issueCounts.medium || 0,
      low: review.issueCounts.low || 0
    };
  }

  return (review?.issues || []).reduce((counts, issue) => {
    const severity = issue.severity || "low";
    counts[severity] = (counts[severity] || 0) + 1;
    return counts;
  }, { critical: 0, high: 0, medium: 0, low: 0 });
}

function getScoreStatus(score = 0) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Improvement";
  return "Critical Issues Detected";
}

function getRiskLevel(score = 0, issueCounts = {}) {
  if ((issueCounts.critical || 0) > 0 || (issueCounts.high || 0) > 1 || score < 60) return "High Risk";
  if ((issueCounts.high || 0) > 0 || (issueCounts.medium || 0) > 2 || score < 75) return "Medium Risk";
  return "Low Risk";
}

function getReadiness(issueCounts = {}, score = 0) {
  if ((issueCounts.critical || 0) > 0 || (issueCounts.high || 0) > 0 || score < 60) return "Not Ready";
  if ((issueCounts.medium || 0) > 0 || score < 75) return "Needs Improvement";
  return "Ready";
}

function getVerdict(readiness) {
  if (readiness === "Ready") return "Ready for Production";
  if (readiness === "Not Ready") return "Not Ready for Production";
  return "Needs Improvement";
}

function riskBadge(riskLevel) {
  if (riskLevel === "Low Risk") return "🟢";
  if (riskLevel === "Medium Risk") return "🟡";
  return "🔴";
}

function readinessBadge(readiness) {
  if (readiness === "Ready") return "✅";
  if (readiness === "Needs Improvement") return "⚠";
  return "❌";
}

function IntegrationsPage({ integrations, setIntegrations, notify }) {
  const save = () => notify("Integration settings saved.");

  return (
    <div className="dashboard">
      <PageHeader icon={<Lock size={16} />} eyebrow="API & Integrations" title="Mistral, GitHub, and SonarQube" />
      <section className="settings-form">
        <label>
          Mistral API Key
          <input value={integrations.mistralKey} onChange={(event) => setIntegrations({ ...integrations, mistralKey: event.target.value })} />
        </label>
        <label>
          GitHub Integration
          <input value={integrations.github} onChange={(event) => setIntegrations({ ...integrations, github: event.target.value })} placeholder="GitHub token or app connection name" />
        </label>
        <label>
          SonarQube Integration
          <input value={integrations.sonarqube} onChange={(event) => setIntegrations({ ...integrations, sonarqube: event.target.value })} placeholder="SonarQube server URL" />
        </label>
        <button className="primary" type="button" onClick={save}>Save integrations</button>
      </section>
    </div>
  );
}

function HistoryPage({ historyItems }) {
  const [query, setQuery] = useState("");
  const filtered = historyItems.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="dashboard">
      <PageHeader icon={<History size={16} />} eyebrow="Review History" title="Previous scans" />
      <label className="search-box">
        Search and filter reports
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by project, language, score..." />
      </label>
      <div className="table-card top-gap">
        {filtered.map(([name, stack, status, date]) => (
          <div className="table-row" key={`${name}-${date}`}>
            <strong>{name}</strong>
            <span>{stack}</span>
            <span>{status}</span>
            <span>{date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage({ settings, setSettings }) {
  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="dashboard">
      <PageHeader icon={<Settings size={16} />} eyebrow="Settings" title="Theme, model, and review preferences" />
      <section className="settings-form compact-form">
        <label>
          Theme
          <select value={settings.theme} onChange={(event) => setSettings({ ...settings, theme: event.target.value })}>
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </label>
        <label>
          Model selection
          <select value={settings.model} onChange={(event) => setSettings({ ...settings, model: event.target.value })}>
            <option>mistral-large-latest</option>
            <option>mistral-small-latest</option>
            <option>codestral-latest</option>
          </select>
        </label>
      </section>
      <section className="settings-grid">
        <ToggleCard title="Security review" text="Check secrets, auth, injections, and unsafe data handling." enabled={settings.securityFirst} onToggle={() => toggle("securityFirst")} icon={<Lock />} />
        <ToggleCard title="Performance review" text="Check bottlenecks and optimization opportunities." enabled={settings.performanceReview} onToggle={() => toggle("performanceReview")} icon={<Sparkles />} />
        <ToggleCard title="Maintainability review" text="Check code smells, best practices, and long-term quality." enabled={settings.maintainabilityReview} onToggle={() => toggle("maintainabilityReview")} icon={<BookOpenCheck />} />
        <ToggleCard title="Line-by-line review" text="Show detailed issues for individual code areas." enabled={settings.lineByLine} onToggle={() => toggle("lineByLine")} icon={<Code2 />} />
      </section>
    </div>
  );
}

function DocsPage() {
  return (
    <div className="dashboard">
      <PageHeader icon={<User size={16} />} eyebrow="About / Documentation" title="How it works, FAQs, and user guide" />
      <section className="cards-grid">
        <InfoCard title="How it works" meta="Flow" text="Upload or paste code, select language/framework, send to the backend, and receive Mistral-powered review results." />
        <InfoCard title="FAQs" meta="Help" text="API keys stay on the backend. Repository and SonarQube screens are ready for real integrations." />
        <InfoCard title="User guide" meta="Steps" text="Start with Code Review, inspect Results, then export JSON, CSV, or PDF reports." />
      </section>
    </div>
  );
}

function SupportPage({ support, setSupport, notify }) {
  const submit = (event) => {
    event.preventDefault();
    notify("Feedback submitted.");
    setSupport({ ...support, message: "" });
  };

  return (
    <div className="dashboard">
      <PageHeader icon={<Mail size={16} />} eyebrow="Contact / Support" title="Feedback form and support details" />
      <section className="profile-layout">
        <form className="settings-form" onSubmit={submit}>
          <label>
            Name
            <input value={support.name} onChange={(event) => setSupport({ ...support, name: event.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={support.email} onChange={(event) => setSupport({ ...support, email: event.target.value })} />
          </label>
          <label>
            Feedback
            <textarea className="small-textarea" value={support.message} onChange={(event) => setSupport({ ...support, message: event.target.value })} placeholder="Tell us what you need help with." />
          </label>
          <button className="primary" type="submit">Send feedback</button>
        </form>
        <div className="report-panel">
          <h2>Support details</h2>
          <p>Email: support@codereview-ai.local</p>
          <p>Response time: 24-48 hours</p>
          <p>Include language, framework, error message, and scan type for faster help.</p>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, meta, text }) {
  return (
    <article className="info-card">
      <span>{meta}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}

function ToggleCard({ title, text, enabled = false, icon, onToggle }) {
  return (
    <article className="toggle-card">
      <div>
        <span className="toggle-icon">{icon || <CheckCircle2 />}</span>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>
      <button className={`switch ${enabled ? "on" : ""}`} aria-label={`${title} toggle`} onClick={onToggle}>
        <span></span>
      </button>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ActionCard({ title, text, action, onClick }) {
  return (
    <article className="info-card">
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="primary card-action" onClick={onClick}>{action}</button>
    </article>
  );
}

function EmptyPanel({ title, text }) {
  return (
    <div className="empty-panel">
      <ScanSearch size={32} />
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Issue({ issue }) {
  return (
    <article className={`issue ${issue.severity || "low"}`}>
      <div>
        <span>{issue.severity || "low"}</span>
        <h3>{issue.title}</h3>
      </div>
      <p>{issue.details}</p>
      <strong>{issue.suggestion}</strong>
    </article>
  );
}

function ResultList({ title, items = [] }) {
  if (!items.length) return null;
  return (
    <div className="result-list">
      <h2>{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
