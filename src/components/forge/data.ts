/* ── Content sourced from the-pi-lab/linkedin-skillforge ── */

export interface Domain {
  index: string;
  name: string;
  purpose: string;
  skills: string[];
}

export const DOMAINS: Domain[] = [
  {
    index: "01",
    name: "Foundation",
    purpose: "Maximize discoverability, authority, headline impact and algorithm indexing.",
    skills: ["profile-optimization", "personal-branding", "linkedin-seo"],
  },
  {
    index: "02",
    name: "Content Engine",
    purpose: "Scroll-stopping thought leadership, hook structures, dwell-time optimization.",
    skills: [
      "content-creation",
      "copywriting",
      "ai-content-generation",
      "algorithm-optimization",
      "content-scheduling",
    ],
  },
  {
    index: "03",
    name: "Prospecting",
    purpose: "Identify high-intent accounts, map buying committees, qualify rigorously.",
    skills: [
      "lead-generation",
      "sales-navigator",
      "prospect-research",
      "b2b-prospecting",
      "lead-qualification",
    ],
  },
  {
    index: "04",
    name: "Outreach",
    purpose: "Cold prospects into warm conversations — personalized, never spammy.",
    skills: [
      "outreach-automation",
      "cold-messaging",
      "connection-strategy",
      "social-selling",
      "ai-personalization",
      "appointment-setting",
      "email-outreach-integration",
      "networking",
    ],
  },
  {
    index: "05",
    name: "Strategy",
    purpose: "ABM orchestration, pipeline velocity and audience retention loops.",
    skills: ["sales-funnel", "abm", "growth-strategy", "engagement-strategy"],
  },
  {
    index: "06",
    name: "Automation",
    purpose: "Autonomous multi-agent systems with safety interlocks and rate guardrails.",
    skills: ["ai-agent-development", "workflow-automation", "automation-compliance"],
  },
  {
    index: "07",
    name: "Data & CRM",
    purpose: "Bi-directional sync with HubSpot, Salesforce and Apollo/Clearbit lakes.",
    skills: ["crm-integration", "data-enrichment"],
  },
  {
    index: "08",
    name: "Analytics & Intel",
    purpose: "Post performance, competitor gaps and pipeline conversion attribution.",
    skills: [
      "analytics-reporting",
      "competitor-analysis",
      "market-research",
      "conversion-tracking",
    ],
  },
  {
    index: "09",
    name: "Talent & Career",
    purpose: "Source top-percentile talent, position culture attractively.",
    skills: ["recruitment-automation", "job-search-optimization", "employer-branding"],
  },
  {
    index: "10",
    name: "Paid Campaigns",
    purpose: "Ads budgeting, matched audiences, CTR optimization and API bridging.",
    skills: ["ads-management", "campaign-optimization", "api-integration"],
  },
];

export interface Stage {
  key: string;
  title: string;
  desc: string;
}

export const EVOLUTION_STAGES: Stage[] = [
  {
    key: "OBSERVE",
    title: "Real run evidence",
    desc: "Every production execution is logged with outcomes, confidence and reviewer notes.",
  },
  {
    key: "SCORE",
    title: "Benchmark IQ",
    desc: "Scorecards rank each skill's live performance — no vibes, only measured behavior.",
  },
  {
    key: "PROPOSE",
    title: "Bounded diffs",
    desc: "Improvements arrive as small, reviewable, constrained proposals — never wild mutation.",
  },
  {
    key: "VALIDATE",
    title: "Schema gates",
    desc: "Draft 2020-12 validation, semantic versioning and safety linting run automatically.",
  },
  {
    key: "RELEASE",
    title: "Human signoff",
    desc: "A maintainer must approve every change. The engine refuses to ship without it.",
  },
  {
    key: "MONITOR",
    title: "Drift watch",
    desc: "Post-release regression tracking catches silent behavioral drift on every skill.",
  },
];

export const CAPABILITIES = [
  "get_profile(id)",
  "get_company(id)",
  "search(query)",
  "enrich_contact(data)",
  "send_message(rcpt, text)",
  "create_appointment(lead, slot)",
  "post_content(body)",
  "schedule_post(time, body)",
  "get_analytics(metric)",
  "create_crm_record(deal)",
  "track_conversion(event)",
  "manage_ads(campaign)",
];

export interface Ide {
  name: string;
  dest: string;
  status: "Native" | "Ready" | "Universal";
}

export const IDES: Ide[] = [
  { name: "Claude Code", dest: ".claude/skills/", status: "Native" },
  { name: "Cursor", dest: ".cursor/skills/", status: "Ready" },
  { name: "Windsurf", dest: ".windsurf/skills/", status: "Ready" },
  { name: "VS Code", dest: ".vscode/skills/", status: "Ready" },
  { name: "Cline", dest: ".cline/skills/", status: "Native" },
  { name: "Roo Code", dest: ".roo/skills/", status: "Native" },
  { name: "Zed", dest: ".zed/skills/", status: "Native" },
  { name: "JetBrains", dest: ".idea/skills/", status: "Native" },
  { name: "Neovim", dest: ".nvim/skills/", status: "Native" },
  { name: "Generic Agent", dest: "linkedin-skills/", status: "Universal" },
];

export const SAFETY_ALWAYS = [
  "Human-in-the-loop interlocks on critical actions",
  "Audit trail first — every step logged with origin",
  "Strict daily volume caps and opt-out compliance",
  "Analysis-only fallback when tools are absent",
];

export const SAFETY_NEVER = [
  "Session hijacking or cookie theft",
  "CAPTCHA bypass or DOM tampering scripts",
  "Aggressive automation evasion tactics",
  "Rate-limit bypassing or brute-force mass spam",
];

export const REPO_URL = "https://github.com/the-pi-lab/linkedin-skillforge";

/* ── The Π Lab links ── */
export const PI_LAB_URL = "https://www.thepilab.in";
export const PI_LAB_LINKEDIN_URL =
  "https://www.linkedin.com/company/the-%CF%80-lab/";
export const FOUNDER_LINKEDIN_URL =
  "https://www.linkedin.com/in/vinayak-mahavar-the-%CF%80-lab-1a1802394";

export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Architecture" | "Integration" | "Compliance";
}

export const FAQS: FAQItem[] = [
  {
    category: "General",
    question: "What is PI SkillForge?",
    answer:
      "PI SkillForge is an open-source, contract-governed reasoning and intelligence layer for LinkedIn workflows engineered by The PI Lab. It provides 40 production-grade reasoning modules across 10 operational domains with zero runtime dependencies and Draft 2020-12 schema validation.",
  },
  {
    category: "Architecture",
    question: "How does SkillForge differ from prompt engineering for LinkedIn?",
    answer:
      "Prompts are volatile scripts that fuse thinking with execution plumbing, causing silent drift, hallucinations, and breaking changes when LLM models update. SkillForge decouples 'what an agent thinks' (reusable 27-section contracts) from 'how it executes' (swappable adapter boundary), ensuring consistent behavior regardless of whether you run Claude, GPT-4o, or Gemini.",
  },
  {
    category: "Integration",
    question: "Which IDEs and agent runtimes are supported?",
    answer:
      "SkillForge includes an automated workspace installer CLI supporting 10+ targets: Claude Code (.claude/skills/), Cursor (.cursor/skills/), Windsurf (.windsurf/skills/), VS Code (.vscode/skills/), Cline (.cline/skills/), Roo Code (.roo/skills/), Zed (.zed/skills/), JetBrains (.idea/skills/), Neovim (.nvim/skills/), and universal agent directories (linkedin-skills/).",
  },
  {
    category: "Compliance",
    question: "Is PI SkillForge compliant with LinkedIn's Terms of Service?",
    answer:
      "Yes. SkillForge is designed from the ground up to fail closed. It operates strictly via official APIs or operator-supplied tooling, enforces human-in-the-loop review on all high-stakes outreach, logs full audit trails with provenance metadata, and strictly prohibits cookie theft, DOM tampering, CAPTCHA bypass, or aggressive mass spamming.",
  },
  {
    category: "General",
    question: "What are the 10 domains and 40 skills included?",
    answer:
      "The 40 skills cover every phase of the LinkedIn lifecycle: Foundation (profile & SEO), Content Engine (copywriting & dwell time), Prospecting (lead gen & qualification), Outreach (cold messaging & social selling), Strategy (ABM & sales funnel), Automation (compliance & agent workflows), Data & CRM (HubSpot & Salesforce sync), Analytics & Intel (competitor & post tracking), Talent & Career (recruitment & employer branding), and Paid Campaigns (ads management & optimization).",
  },
  {
    category: "Architecture",
    question: "How does the 6-gate governed self-evolution loop work?",
    answer:
      "Unlike uncontrolled prompt mutation, SkillForge evolves through six verifiable gates: OBSERVE (log real execution evidence), SCORE (quantify live IQ), PROPOSE (generate bounded diffs), VALIDATE (enforce Draft 2020-12 JSON schemas and semver), RELEASE (require maintainer human signoff), and MONITOR (track post-deployment drift). The system automatically halts if any gate fails.",
  },
  {
    category: "Integration",
    question: "How do I install and deploy SkillForge to my agent?",
    answer:
      "Clone the repo (`git clone https://github.com/the-pi-lab/linkedin-skillforge.git`), verify integrity with `python -m unittest discover -s tests`, and run `python ide/install.py install --skill <skill-name> --ide auto --apply`. Zero npm build bloat, pure Python standard library, ready in 60 seconds.",
  },
];
