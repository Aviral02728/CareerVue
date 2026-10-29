import { ChangeEvent, FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, Eye, EyeOff, FileText, LockKeyhole, ShieldCheck, Trash2, UploadCloud } from "lucide-react";

type Analysis = {
  analysis_id?: number;
  saved_id?: number;
  filename: string;
  text_stats: { word_count: number; reading_time_min: number; characters: number };
  match_analysis: { match_percentage: number; total_matched: number; total_jd_skills: number; matched_skills: string[]; missing_skills: string[] };
  semantic_insights?: { enabled: boolean; method: string; model?: string; message?: string; matches?: { requirement: string; evidence: string; similarity: number; supported: boolean }[] };
  scores: { total_score: number; semantic_similarity: number; skill_alignment: number; keyword_density: number; experience_relevance: number; formatting_score: number; feedback: string[] };
};
type LinkedinContent = { headline: string; about_section: string; recommended_keywords: string[]; ats_score: { score: number; feedback: string[] } };

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [linkedin, setLinkedin] = useState<LinkedinContent | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);
  const [token, setToken] = useState(localStorage.getItem("careervue_token") ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignup, setShowSignup] = useState(!localStorage.getItem("careervue_token"));
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [activeView, setActiveView] = useState<"analyzer" | "linkedin" | "history">("analyzer");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const passwordStrength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
  ].filter(Boolean).length;

  const submitAuth = async (path: "login" | "register") => {
    setMessage("");
    if (path === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Authentication failed.");
      localStorage.setItem("careervue_token", data.access_token);
      setToken(data.access_token);
      setMessage("You are signed in.");
      setShowSignup(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setMessage(selected ? `${selected.name} is ready to analyze.` : "");
  };

  const analyze = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !jobDescription.trim()) {
      setMessage("Add a resume and job description before analyzing.");
      return;
    }
    if (!token) {
      setMessage("Sign in before starting an analysis.");
      return;
    }
    setBusy(true);
    setMessage("");
    const form = new FormData();
    form.append("resume_file", file);
    form.append("job_description", jobDescription);
    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "Analysis failed.");
      setAnalysis(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Analysis failed.");
    } finally {
      setBusy(false);
    }
  };

  const generateLinkedin = async () => {
    if (!file || !token) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("resume_file", file);
      form.append("job_description", jobDescription);
      const response = await fetch(`${API_URL}/linkedin-optimize`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? "LinkedIn optimization failed.");
      setLinkedin(data);
      setActiveView("linkedin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "LinkedIn optimization failed.");
    } finally {
      setBusy(false);
    }
  };

  const loadHistory = async () => {
    if (!token) return;
    const response = await fetch(`${API_URL}/analyses`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) setHistory(data.map((item: { id: number; result: Analysis }) => ({ ...item.result, saved_id: item.id })));
  };

  const deleteSavedReview = async (review: Analysis) => {
    if (!review.saved_id) {
      setMessage("This saved review has no valid database ID. Refresh and try again.");
      return;
    }
    if (pendingDeleteId !== review.saved_id) {
      setPendingDeleteId(review.saved_id);
      setMessage(`Delete "${review.filename}"? Click the delete button again to confirm.`);
      return;
    }
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/analyses/${review.saved_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMessage(data.detail ?? "Could not delete the saved review.");
        return;
      }
      setHistory((items) => items.filter((item) => item.saved_id !== review.saved_id));
      setPendingDeleteId(null);
      setMessage("Saved review deleted.");
    } catch {
      setMessage("Could not reach the server. Check that the CareerVue API is running.");
    }
  };

  if (showSignup) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <button className="back-link" onClick={() => { setShowSignup(false); setMessage(""); }}>
            <ArrowLeft size={17} /> View CareerVue
          </button>
          <div className="signup-layout">
            <section className="signup-intro">
              <div className="brand"><span className="brand-mark">CV</span> CareerVue</div>
              <div className="eyebrow">CAREERVUE ACCOUNT</div>
              <h1>{authMode === "signup" ? <>Keep your job search <em>organised.</em></> : <>Welcome back to <em>CareerVue.</em></>}</h1>
              <p>{authMode === "signup" ? "Create an account to compare applications, track improvements, and keep your career documents in one place." : "Sign in to pick up where you left off and review your saved applications."}</p>
              {authMode === "signup" && <div className="signup-benefits">
                <div><Check size={18} /><span><strong>Compare applications</strong> Check how your resume matches each role.</span></div>
                <div><Check size={18} /><span><strong>Keep a record</strong> Return to previous reviews when you need them.</span></div>
                <div><Check size={18} /><span><strong>Improve your profile</strong> Prepare clear, role-specific LinkedIn content.</span></div>
              </div>}
            </section>
            <section className="signup-card">
              <div className="signup-card-head"><span className="signup-icon"><LockKeyhole size={20} /></span><div><h2>{authMode === "signup" ? "Create your account" : "Sign in"}</h2><p>{authMode === "signup" ? "Start with CareerVue for free." : "Access your saved career reviews."}</p></div></div>
              <form onSubmit={(event) => { event.preventDefault(); submitAuth(authMode === "signup" ? "register" : "login"); }}>
                <label className="form-field">Email address<input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
                <label className="form-field">Password<div className="password-input"><input type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{authMode === "signup" && <div className="password-help"><div className="strength-bars"><i className={passwordStrength >= 1 ? "active" : ""} /><i className={passwordStrength >= 2 ? "active" : ""} /><i className={passwordStrength >= 3 ? "active" : ""} /></div><span>{passwordStrength < 2 ? "Use 8+ characters, one capital letter, and one number." : passwordStrength === 2 ? "Good start. Add one more requirement." : "Strong password."}</span></div>}</label>
                {authMode === "signup" && <label className="form-field">Confirm password<input type={showPassword ? "text" : "password"} placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required /></label>}
                <button className="primary signup-submit" type="submit" disabled={busy}>{busy ? (authMode === "signup" ? "Creating account..." : "Signing in...") : <>{authMode === "signup" ? "Create my account" : "Sign in"} <ArrowRight size={18} /></>}</button>
              </form>
              {message && <div className="notice">{message}</div>}
              {authMode === "signup" && <p className="terms">By creating an account, you agree to use CareerVue responsibly and keep your credentials secure.</p>}
              <div className="signin-prompt">{authMode === "signup" ? <>Already have an account? <button onClick={() => { setAuthMode("login"); setMessage(""); }}>Sign in</button></> : <>New to CareerVue? <button onClick={() => { setAuthMode("signup"); setMessage(""); }}>Create an account</button></>}</div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <nav className="nav container">
        <div className="brand"><span className="brand-mark">CV</span> CareerVue</div>
        <span className="tagline">See your career more clearly.</span>
        <div className="auth">
          {token ? <><button className={`nav-link ${activeView === "analyzer" ? "selected" : ""}`} onClick={() => setActiveView("analyzer")}>Resume analyzer</button><button className={`nav-link ${activeView === "linkedin" ? "selected" : ""}`} onClick={() => setActiveView("linkedin")}>LinkedIn optimizer</button><button className={`nav-link ${activeView === "history" ? "selected" : ""}`} onClick={() => { setActiveView("history"); loadHistory(); }}>Saved reviews</button><button className="ghost" onClick={() => { localStorage.removeItem("careervue_token"); setToken(""); }}>Sign out</button></> : (
            <><button className="ghost" onClick={() => { setAuthMode("login"); setShowSignup(true); setMessage(""); }}>Sign in</button><button className="primary small" onClick={() => { setAuthMode("signup"); setShowSignup(true); setMessage(""); }}>Create account</button></>
          )}
        </div>
      </nav>

      {token && activeView === "analyzer" && <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">RESUME AND PROFILE REVIEW</div>
          <h1>Make your next application <em>more focused.</em></h1>
          <p>Review your resume against a specific role, understand what needs attention, and prepare a stronger version of your professional profile.</p>
          <div className="proof"><Check size={17} /> Resume review · Role comparison · Profile writing</div>
        </div>
        <div className="hero-card">
          <div className="insight-preview">
            <div className="preview-top"><span>CAREERVUE INSIGHT</span><span className="preview-status">READY</span></div>
            <div className="preview-title">Your next role, mapped out.</div>
            <div className="preview-bars"><span style={{ width: "88%" }} /><span style={{ width: "71%" }} /><span style={{ width: "54%" }} /></div>
            <div className="preview-labels"><span>Strengths</span><span>Keywords</span><span>Growth areas</span></div>
            <div className="preview-footer"><BarChart3 size={18} /> Clear signals for a sharper application.</div>
          </div>
        </div>
      </section>

      <section className="workspace container">
        <div className="section-heading"><span>01</span><div><h2>Start with your target role</h2><p>Upload once, then get a clear action plan.</p></div></div>
        <form className="input-grid" onSubmit={analyze}>
          <label className="upload-card">
            <UploadCloud size={28} />
            <strong>{file ? file.name : "Drop your resume here"}</strong>
            <span>PDF, DOC, or DOCX · up to 5 MB</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />
          </label>
          <label className="jd-card">
            <div className="label-row"><FileText size={18} /> Job description</div>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the role description you are targeting..." />
            <span>{jobDescription.length} characters</span>
          </label>
          <button className="primary analyze" disabled={busy}>{busy ? "Analyzing..." : <>Analyze my fit <ArrowRight size={18} /></>}</button>
        </form>
        {message && <div className="notice">{message}</div>}
      </section>

      {analysis && <section className="results container">
        <div className="section-heading"><span>02</span><div><h2>Your CareerVue snapshot</h2><p>{analysis.filename} · {analysis.text_stats.word_count} words</p></div></div>
        <div className="metrics">
          <Metric label="Career fit" value={`${Math.round(analysis.match_analysis.match_percentage)}%`} accent="blue" />
          <Metric label="Resume strength" value={`${analysis.scores.total_score}/100`} accent="green" />
          <Metric label="Matched skills" value={`${analysis.match_analysis.total_matched}/${analysis.match_analysis.total_jd_skills}`} accent="purple" />
          <Metric label="Reading time" value={`${analysis.text_stats.reading_time_min} min`} accent="slate" />
        </div>
        <div className="result-grid">
          <article className="panel"><h3>What is working</h3><div className="chips">{analysis.match_analysis.matched_skills.map((skill) => <span className="chip good" key={skill}>{skill}</span>)}</div></article>
          <article className="panel"><h3>Where to focus next</h3><div className="chips">{analysis.match_analysis.missing_skills.map((skill) => <span className="chip missing" key={skill}>{skill}</span>)}</div></article>
          <article className="panel feedback"><h3>Recommended actions</h3>{analysis.scores.feedback.map((item) => <p key={item}><Check size={16} /> {item}</p>)}</article>
        </div>
        <div className="recommendations panel"><div className="panel-heading"><div><h3>Changes that will improve this resume</h3><p>Practical edits based on the gaps in this review.</p></div></div><div className="recommendation-grid"><RecommendationList analysis={analysis} /></div></div>
        <div className="breakdown panel"><div className="panel-heading"><div><h3>Resume strength breakdown</h3><p>How the score is built across the main review areas.</p></div><strong>{analysis.scores.total_score}/100</strong></div><ScoreBar label="Semantic similarity" value={analysis.scores.semantic_similarity} max={30} /><ScoreBar label="Skill alignment" value={analysis.scores.skill_alignment} max={25} /><ScoreBar label="Keyword density" value={analysis.scores.keyword_density} max={20} /><ScoreBar label="Experience relevance" value={analysis.scores.experience_relevance} max={15} /><ScoreBar label="Formatting" value={analysis.scores.formatting_score} max={10} /></div>
        <div className="visual-panel panel"><div className="panel-heading"><div><h3>Skill coverage</h3><p>How your detected skills compare with the target role.</p></div></div><SkillCoverageChart analysis={analysis} /></div>
        {analysis.semantic_insights?.enabled && analysis.semantic_insights.matches?.length ? <div className="evidence-panel panel"><div className="panel-heading"><div><h3>Role requirements and resume evidence</h3><p>Local semantic matching shows which resume lines support the target role.</p></div></div><div className="evidence-list">{analysis.semantic_insights.matches.slice(0, 6).map((match) => <div className="evidence-row" key={`${match.requirement}-${match.evidence}`}><div><strong>{match.requirement}</strong><p>{match.evidence}</p></div><span className={match.supported ? "evidence-supported" : "evidence-review"}>{Math.round(match.similarity * 100)}%</span></div>)}</div></div> : null}
        <div className="linkedin-callout">
          <div><div className="callout-marker" /><div><h3>Prepare your LinkedIn profile</h3><p>Create a headline, About section, and keyword list based on this review.</p></div></div>
          <button className="primary" onClick={generateLinkedin} disabled={busy}>Optimize LinkedIn <ArrowRight size={18} /></button>
        </div>
      </section>}
      </>}

      {token && activeView === "linkedin" && <section className="tool-page container">
        <div className="section-heading"><span>02</span><div><h2>LinkedIn optimizer</h2><p>Turn your resume review into clear, editable profile copy.</p></div></div>
        {!linkedin ? <div className="empty-panel panel"><h3>Run a resume review first</h3><p>Upload your resume and paste a target role in the Resume analyzer. CareerVue will use that context to draft your headline, About section, and keyword plan.</p><button className="primary" onClick={() => setActiveView("analyzer")}>Open resume analyzer <ArrowRight size={18} /></button></div> : <div className="linkedin-workspace">
          <div className="linkedin-summary panel"><div><span className="eyebrow">PROFILE REVIEW</span><h3>Your LinkedIn draft</h3><p>Use the suggestions as a starting point, then edit them to sound like you.</p></div><div className="ats-score"><span>ATS readiness</span><strong>{linkedin.ats_score.score}/100</strong></div></div>
          <div className="linkedin-panel panel"><label>Headline <span>{linkedin.headline.length}/220 characters</span><textarea value={linkedin.headline} onChange={(e) => setLinkedin({ ...linkedin, headline: e.target.value })} /></label><label>About section <span>{linkedin.about_section.split(/\s+/).filter(Boolean).length} words</span><textarea className="about-box" value={linkedin.about_section} onChange={(e) => setLinkedin({ ...linkedin, about_section: e.target.value })} /></label></div>
          <div className="panel keyword-panel"><div className="panel-heading"><div><h3>Keywords to consider</h3><p>Terms from the target role that are not strongly represented in the resume.</p></div></div><div className="chips">{linkedin.recommended_keywords.length ? linkedin.recommended_keywords.map((keyword) => <span className="chip good" key={keyword}>{keyword}</span>) : <span className="muted">Your resume already covers the main role keywords.</span>}</div><div className="ats-feedback">{linkedin.ats_score.feedback.map((item) => <p key={item}><Check size={15} /> {item}</p>)}</div></div>
        </div>}
      </section>}

      {token && activeView === "history" && <section className="tool-page container">
        <div className="section-heading"><span>03</span><div><h2>Saved reviews</h2><p>Keep a record of the roles you have prepared for.</p></div></div>
        <div className="history panel">{history.length ? history.map((item, index) => <div className="history-row" key={item.saved_id ?? `${item.filename}-${index}`}><div><strong>{item.filename}</strong><small>{item.text_stats.word_count} words · {item.text_stats.reading_time_min} min read</small></div><div className="history-actions"><strong>{Math.round(item.match_analysis.match_percentage)}% fit</strong><button className={`delete-review ${pendingDeleteId === item.saved_id ? "confirm-delete" : ""}`} type="button" onClick={() => deleteSavedReview(item)} aria-label={pendingDeleteId === item.saved_id ? `Confirm deletion of ${item.filename}` : `Delete saved review for ${item.filename}`} title={pendingDeleteId === item.saved_id ? "Click again to confirm deletion" : "Delete saved review"}>{pendingDeleteId === item.saved_id ? "Confirm" : <Trash2 size={16} />}</button></div></div>) : <div className="empty-panel"><h3>No saved reviews yet</h3><p>Your completed resume reviews will appear here.</p><button className="primary" onClick={() => setActiveView("analyzer")}>Start a review <ArrowRight size={18} /></button></div>}</div>
      </section>}

      <footer className="container footer"><ShieldCheck size={18} /> Your resume is processed securely for your analysis.</footer>
    </main>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return <div className={`metric ${accent}`}><span>{label}</span><strong>{value}</strong><small>Based on your target role</small></div>;
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  return <div className="score-row"><div><span>{label}</span><strong>{value.toFixed(1)} / {max}</strong></div><div className="score-track"><span style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div></div>;
}

function RecommendationList({ analysis }: { analysis: Analysis }) {
  const recommendations: string[] = [];
  if (analysis.scores.formatting_score < 7) recommendations.push("Use clear section headings for experience, education, skills, and contact details.");
  if (analysis.scores.keyword_density < 15) recommendations.push("Repeat the role's important terms naturally in your summary and experience bullets.");
  if (analysis.scores.experience_relevance < 10) recommendations.push("Rewrite bullets with an action, the work completed, and a measurable result where possible.");
  if (analysis.scores.semantic_similarity < 18) recommendations.push("Tailor the opening summary so it reflects the responsibilities and language of this role.");
  if (analysis.match_analysis.missing_skills.length) recommendations.push(`Address the most relevant gaps: ${analysis.match_analysis.missing_skills.slice(0, 5).join(", ")}.`);
  if (!recommendations.length) recommendations.push("Your baseline is strong. Focus on measurable outcomes and keeping the language specific to each role.");
  return <>{recommendations.map((recommendation, index) => <div className="recommendation" key={recommendation}><span>{String(index + 1).padStart(2, "0")}</span><p>{recommendation}</p></div>)}</>;
}

function SkillCoverageChart({ analysis }: { analysis: Analysis }) {
  const total = Math.max(analysis.match_analysis.total_jd_skills, 1);
  const matched = analysis.match_analysis.total_matched;
  const missing = analysis.match_analysis.missing_skills.length;
  const percentage = Math.min(100, Math.round((matched / total) * 100));
  return <div className="coverage-chart"><div className="coverage-ring" style={{ background: `conic-gradient(#b7efce ${percentage}%, #35495b ${percentage}% 100%)` }}><div><strong>{percentage}%</strong><span>covered</span></div></div><div className="coverage-legend"><div><i className="legend-dot matched" /><span>Matched skills</span><strong>{matched}</strong></div><div><i className="legend-dot missing" /><span>Skills to address</span><strong>{missing}</strong></div><div className="coverage-track"><span style={{ width: `${percentage}%` }} /></div><small>{matched} of {total} skills from the target role were found in your resume.</small></div></div>;
}

export default App;
