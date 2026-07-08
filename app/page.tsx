"use client";

import { useEffect, useState } from "react";

type Mode = "home" | "system" | "bug";
type SystemSection = "repository" | "agents" | "quality";
type BugStage = "report" | "progress" | "analysis" | "pr";

const agents = [
  ["Product Agent", "Helps clarify impact, acceptance criteria, and product context."],
  ["QA Agent", "Helps generate test cases, edge cases, and regression scenarios."],
  ["Backend Agent", "Helps identify backend impact, propose implementation, and add tests."],
  ["Frontend Agent", "Helps review UI states, edge cases, messages, and UX consistency."],
  ["Review Agent", "Helps summarize changes, detect risks, and prepare PRs for human review."],
];

const qualityGates = [
  {
    title: "Tests Required",
    bullets: ["Existing tests must run.", "New tests should be added when relevant.", "If no test is added, the PR must explain why."],
  },
  { title: "No Secrets", bullets: ["Blocks tokens, credentials, keys, customer data, and production config leaks."] },
  { title: "PR Checklist", bullets: ["Every PR must include problem, solution, affected files, evidence, risk, and linked ticket."] },
  { title: "Risk Summary", bullets: ["Summarizes affected modules, functional risk, technical risk, and recommended validations."] },
  { title: "Human Review", bullets: ["No auto-merge.", "No automatic deploy.", "Human approval is always required."] },
];

const progressSteps = [
  "Reading repository context",
  "Loading CLAUDE.md",
  "Loading bug-to-pr skill",
  "Running Product Agent",
  "Running QA Agent",
  "Running Backend Agent",
  "Applying Quality Gates",
];

function Button({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/20 backdrop-blur ${className}`}>{children}</div>;
}

function SystemNode({ label, active, onClick }: { label: SystemSection; active: boolean; onClick: () => void }) {
  const text = label === "repository" ? "Repository" : label === "agents" ? "AI Agents" : "Quality";
  return (
    <button
      onClick={onClick}
      className={`min-w-48 rounded-2xl border px-8 py-6 text-center text-sm font-semibold transition hover:-translate-y-1 ${
        active ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.06] text-slate-200 hover:border-white/25 hover:bg-white/10"
      }`}
    >
      {text}
    </button>
  );
}

function Arrow() {
  return <div className="hidden text-2xl text-slate-500 md:block">→</div>;
}

function RepositoryTree() {
  return (
    <Card className="mx-auto max-w-3xl">
      <pre className="overflow-x-auto text-sm leading-7 text-slate-200">
{`/
├── CLAUDE.md
├── docs/
│   ├── product-context.md
│   ├── architecture.md
│   ├── testing-strategy.md
│   ├── coding-standards.md
│   └── release-process.md
└── .claude/
    ├── skills/
    │   ├── bug-to-pr/
    │   ├── test-generator/
    │   ├── code-review/
    │   └── release-notes/
    ├── agents/
    │   ├── qa-agent.md
    │   ├── backend-agent.md
    │   ├── frontend-agent.md
    │   └── product-agent.md
    ├── hooks/
    │   ├── test-required.sh
    │   ├── no-secret-check.sh
    │   └── pr-checklist.sh
    └── settings.json`}
      </pre>
    </Card>
  );
}

function AgentCard({ name, description }: { name: string; description: string }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:border-cyan-300/30">
      <h3 className="mb-3 font-semibold text-white">{name}</h3>
      <p className="text-sm leading-6 text-slate-400">{description}</p>
    </Card>
  );
}

function QualityGate({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <Card>
      <h3 className="mb-3 font-semibold text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-slate-400">
        {bullets.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </Card>
  );
}

function SystemView() {
  const [section, setSection] = useState<SystemSection>("repository");
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col items-center justify-center gap-4 md:flex-row">
        <SystemNode label="repository" active={section === "repository"} onClick={() => setSection("repository")} />
        <Arrow />
        <SystemNode label="agents" active={section === "agents"} onClick={() => setSection("agents")} />
        <Arrow />
        <SystemNode label="quality" active={section === "quality"} onClick={() => setSection("quality")} />
      </div>
      {section === "repository" && <RepositoryTree />}
      {section === "agents" && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{agents.map(([name, description]) => <AgentCard key={name} name={name} description={description} />)}</div>}
      {section === "quality" && <div className="space-y-8"><div className="flex flex-col items-center justify-center gap-3 md:flex-row">{qualityGates.map((gate, index) => <div key={gate.title} className="flex items-center gap-3"><span className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200">{gate.title}</span>{index < qualityGates.length - 1 && <Arrow />}</div>)}</div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{qualityGates.map((gate) => <QualityGate key={gate.title} {...gate} />)}</div></div>}
    </div>
  );
}

function BugDemo() {
  const [stage, setStage] = useState<BugStage>("report");
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (stage !== "progress") return;
    setVisible(0);
    const interval = setInterval(() => setVisible((current) => {
      if (current >= progressSteps.length) {
        clearInterval(interval);
        setTimeout(() => setStage("analysis"), 450);
        return current;
      }
      return current + 1;
    }), 480);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">{["Bug Report", "Repository Context", "AI Agents", "Quality Gates", "Pull Request", "Human Review"].map((step, index, arr) => <div key={step} className="flex items-center gap-3"><span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">{step}</span>{index < arr.length - 1 && <span>→</span>}</div>)}</div>
      {stage === "report" && <Card className="mx-auto max-w-xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold">Bug → PR</h2><span className="rounded-full bg-red-400/15 px-3 py-1 text-xs text-red-200">High</span></div><div className="space-y-4 text-sm text-slate-300"><p><b>Customer:</b> PRUEBA SA</p><p><b>Module:</b> Recurring Invoices</p><p><b>Description:</b> Tax exempt customers cannot generate recurring invoices. The system fails during invoice validation.</p><p><b>Attachment:</b> screenshot.png</p></div><div className="mt-8"><Button onClick={() => setStage("progress")}>Generate Fix</Button></div></Card>}
      {stage === "progress" && <Card className="mx-auto max-w-xl"><h2 className="mb-6 text-xl font-semibold">Bug → PR</h2><div className="space-y-3">{progressSteps.slice(0, visible).map((step) => <div key={step} className="flex animate-pulse items-center gap-3 rounded-2xl bg-white/[0.05] p-4 text-sm text-slate-200"><span className="h-2 w-2 rounded-full bg-cyan-300" />{step}</div>)}</div></Card>}
      {stage === "analysis" && <Card className="mx-auto max-w-xl"><h2 className="mb-6 text-xl font-semibold">Analysis Result</h2><div className="space-y-4 text-sm text-slate-300"><p><b>Root cause:</b> Invoice validation does not handle tax exempt recurring customers correctly.</p><p><b>Affected files:</b> invoice-validator.ts, recurring-invoice-service.ts</p><p><b>Test generated:</b> should_create_recurring_invoice_for_tax_exempt_customer</p><p><b>Suggested risk:</b> Low</p></div><div className="mt-8"><Button onClick={() => setStage("pr")}>Generate Pull Request</Button></div></Card>}
      {stage === "pr" && <Card className="mx-auto max-w-xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold">Pull Request #4831</h2><span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs text-amber-100">Review Pending</span></div><h3 className="mb-5 text-lg text-slate-100">Fix recurring invoice generation for tax exempt customers</h3><div className="grid gap-6 text-sm text-slate-300 md:grid-cols-2"><div><b>Changes</b><ul className="mt-3 space-y-2"><li>• 2 files modified</li><li>• 1 test added</li><li>• Validation logic updated</li></ul></div><div><b>Quality Gates</b><ul className="mt-3 space-y-2"><li>• Tests Required: Passed</li><li>• No Secrets: Passed</li><li>• PR Checklist: Passed</li><li>• Risk Summary: Completed</li><li>• Human Review: Pending</li></ul></div></div><div className="mt-8"><Button disabled>Open in GitHub</Button></div></Card>}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("home");
  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <h1 className="mb-8 text-5xl font-semibold tracking-tight text-white md:text-7xl">Engineering OS</h1>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => setMode("system")}>View System</Button>
            <Button onClick={() => setMode("bug")}>Bug Demo</Button>
          </div>
        </div>
        <div className="w-full">{mode === "system" && <SystemView />}{mode === "bug" && <BugDemo />}</div>
      </section>
    </main>
  );
}
