"use client";

import { useEffect, useId, useRef, useState } from "react";

type Current =
  | "Overwhelmed"
  | "Need Grounding"
  | "Restless"
  | "Seeking Clarity"
  | "Ready to Expand";

type Season =
  | "Things are changing"
  | "Feeling stuck"
  | "Rebuilding"
  | "Open / expanding"
  | "Tender / sensitive";

type MoonPhase = "new" | "crescent" | "half" | "full";

interface ResponseData {
  phrase: string;
  suggestions: string[];
  reflection: string;
}

const currents: Current[] = [
  "Overwhelmed",
  "Need Grounding",
  "Restless",
  "Seeking Clarity",
  "Ready to Expand",
];

const seasons: Season[] = [
  "Things are changing",
  "Feeling stuck",
  "Rebuilding",
  "Open / expanding",
  "Tender / sensitive",
];

const currentKey: Record<Current, string> = {
  "Overwhelmed": "overwhelmed",
  "Need Grounding": "need-grounding",
  "Restless": "restless",
  "Seeking Clarity": "seeking-clarity",
  "Ready to Expand": "ready-to-expand",
};

const seasonKey: Record<Season, string> = {
  "Things are changing": "changing",
  "Feeling stuck": "stuck",
  "Rebuilding": "rebuilding",
  "Open / expanding": "open",
  "Tender / sensitive": "tender",
};

const MOON_MAP: Record<string, MoonPhase> = {
  "overwhelmed:changing":       "crescent",
  "overwhelmed:stuck":          "crescent",
  "overwhelmed:rebuilding":     "crescent",
  "overwhelmed:open":           "half",
  "overwhelmed:tender":         "new",
  "need-grounding:changing":    "crescent",
  "need-grounding:stuck":       "crescent",
  "need-grounding:rebuilding":  "crescent",
  "need-grounding:open":        "half",
  "need-grounding:tender":      "new",
  "restless:changing":          "half",
  "restless:stuck":             "half",
  "restless:rebuilding":        "half",
  "restless:open":              "full",
  "restless:tender":            "crescent",
  "seeking-clarity:changing":   "half",
  "seeking-clarity:stuck":      "crescent",
  "seeking-clarity:rebuilding": "half",
  "seeking-clarity:open":       "full",
  "seeking-clarity:tender":     "crescent",
  "ready-to-expand:changing":   "half",
  "ready-to-expand:stuck":      "half",
  "ready-to-expand:rebuilding": "full",
  "ready-to-expand:open":       "full",
  "ready-to-expand:tender":     "half",
};

const RESPONSES: Record<string, ResponseData> = {
  "overwhelmed:changing": {
    phrase: "A lot is moving at once. You do not have to hold all of it right now.",
    suggestions: [
      "Let one thing be enough for this moment",
      "Drop your shoulders and unclench your jaw",
      "Put the rest in a mental \u2018later\u2019 pile",
    ],
    reflection: "What is actually mine to tend right now?",
  },
  "overwhelmed:stuck": {
    phrase: "When you\u2019re overwhelmed, even stillness can feel loud.",
    suggestions: [
      "Sit down somewhere steady",
      "Choose the smallest possible next thing",
      "Let that count as movement",
    ],
    reflection: "What would make this feel 5% lighter?",
  },
  "overwhelmed:rebuilding": {
    phrase: "This may feel messy, but it is not empty. You are still building.",
    suggestions: [
      "Notice what is already here and working",
      "Let one expectation fall away",
      "Stay close to what feels solid",
    ],
    reflection: "What is still true and usable here?",
  },
  "overwhelmed:open": {
    phrase: "New energy can be beautiful and still be too much.",
    suggestions: [
      "Slow the pace of what you\u2019re taking in",
      "Say yes to one thing, not everything",
      "Let expansion be roomy, not rushed",
    ],
    reflection: "What am I ready for, and what can wait?",
  },
  "overwhelmed:tender": {
    phrase: "Of course this feels like a lot. You\u2019re feeling it with your whole body.",
    suggestions: [
      "Soften the room around you if you can",
      "Wrap up, sit down, breathe lower",
      "Trade fixing for comforting",
    ],
    reflection: "What would feel kind, not productive?",
  },
  "need-grounding:changing": {
    phrase: "Let\u2019s come back to what is here, not everything that might happen.",
    suggestions: [
      "Feel your feet, your chair, your breath",
      "Name three things you can see",
      "Stay with what is real for one minute",
    ],
    reflection: "What is steady underneath all this movement?",
  },
  "need-grounding:stuck": {
    phrase: "You do not need to force motion to find steadiness.",
    suggestions: [
      "Stop trying for one moment",
      "Let your body be exactly where it is",
      "Notice what settles when you stop pushing",
    ],
    reflection: "What changes when I stop bracing?",
  },
  "need-grounding:rebuilding": {
    phrase: "Ground comes back a little at a time.",
    suggestions: [
      "Return to one familiar rhythm",
      "Keep the next step simple",
      "Choose steadiness over intensity",
    ],
    reflection: "What helps me feel like myself again?",
  },
  "need-grounding:open": {
    phrase: "Growth lands better when your body feels safe enough to receive it.",
    suggestions: [
      "Pause before the next yes",
      "Check in with your breath and pace",
      "Let excitement have roots",
    ],
    reflection: "What keeps me anchored while I grow?",
  },
  "need-grounding:tender": {
    phrase: "Softness needs structure too.",
    suggestions: [
      "Lower the volume around you",
      "Stay near what feels gentle and known",
      "Let comfort be part of the plan",
    ],
    reflection: "What helps me feel held, not just okay?",
  },
  "restless:changing": {
    phrase: "Something in you knows the season has shifted.",
    suggestions: [
      "Move your body a little on purpose",
      "Let one thought become one action",
      "Give the energy somewhere to go",
    ],
    reflection: "What is trying to move through me?",
  },
  "restless:stuck": {
    phrase: "Restlessness is often energy with nowhere to land.",
    suggestions: [
      "Stand up and change rooms",
      "Start badly, briefly, imperfectly",
      "Break the spell with one small motion",
    ],
    reflection: "Where could I create a little momentum?",
  },
  "restless:rebuilding": {
    phrase: "You are not wrong for wanting movement before everything feels finished.",
    suggestions: [
      "Follow what feels quietly alive",
      "Try one new shape, not a whole reinvention",
      "Let curiosity lead for a moment",
    ],
    reflection: "What feels possible from here, not from someday?",
  },
  "restless:open": {
    phrase: "This may be your life force knocking.",
    suggestions: [
      "Follow the spark with less analysis",
      "Let yourself explore before you define it",
      "Trust a little motion",
    ],
    reflection: "What feels alive enough to follow?",
  },
  "restless:tender": {
    phrase: "Not all restlessness is forward motion. Some of it is overflow.",
    suggestions: [
      "Ask your body what this energy really is",
      "Choose gentler movement if needed",
      "Let slowness still count as response",
    ],
    reflection: "Is this urge asking for motion, or for care?",
  },
  "seeking-clarity:changing": {
    phrase: "Clarity does not always arrive before the turning. Sometimes it comes from living inside it.",
    suggestions: [
      "Write down what you do know",
      "Leave the rest open without chasing it",
      "Trust that not knowing is also information",
    ],
    reflection: "What is already clear enough to follow?",
  },
  "seeking-clarity:stuck": {
    phrase: "Pressure rarely produces truth.",
    suggestions: [
      "Step back from the question a little",
      "Let your nervous system catch up",
      "Return with softer eyes",
    ],
    reflection: "What becomes clearer when I stop gripping?",
  },
  "seeking-clarity:rebuilding": {
    phrase: "You do not need the whole map to take an honest step.",
    suggestions: [
      "Notice what feels clean, simple, true",
      "Ignore the loudest voice if it is not yours",
      "Let one clear thing be enough",
    ],
    reflection: "What feels quietly right here?",
  },
  "seeking-clarity:open": {
    phrase: "Sometimes clarity comes after contact, not before it.",
    suggestions: [
      "Try the next thing lightly",
      "Let experience teach you",
      "Keep room for surprise",
    ],
    reflection: "What wants to be explored instead of solved?",
  },
  "seeking-clarity:tender": {
    phrase: "Your knowing may be softer than your fear, but it is still there.",
    suggestions: [
      "Listen for what feels true without force",
      "Stay close to what brings relief, not performance",
      "Let your answer arrive in a quieter tone",
    ],
    reflection: "What truth keeps returning, even gently?",
  },
  "ready-to-expand:changing": {
    phrase: "Something in you is already leaning toward the next version of your life.",
    suggestions: [
      "Let yourself want what you want",
      "Take one brave but gentle step",
      "Trust movement more than perfection",
    ],
    reflection: "What is opening in me now?",
  },
  "ready-to-expand:stuck": {
    phrase: "Part of you is ready, even if another part is scared.",
    suggestions: [
      "Let readiness be small and real",
      "Move before certainty fully arrives",
      "Count momentum, not mastery",
    ],
    reflection: "What would expansion look like at my actual capacity?",
  },
  "ready-to-expand:rebuilding": {
    phrase: "You are not rebuilding to become smaller.",
    suggestions: [
      "Grow in ways that feel clean and sustainable",
      "Keep what nourishes, leave what drains",
      "Build for the life you want to stay in",
    ],
    reflection: "What kind of growth can I really live inside?",
  },
  "ready-to-expand:open": {
    phrase: "Yes, this. Let life meet you here.",
    suggestions: [
      "Follow what feels resonant",
      "Stretch without abandoning yourself",
      "Let joy be useful information",
    ],
    reflection: "Where do I feel most alive, awake, or honest?",
  },
  "ready-to-expand:tender": {
    phrase: "You do not have to harden to grow.",
    suggestions: [
      "Expand at a pace your body can trust",
      "Keep softness in the room",
      "Let care be part of the architecture",
    ],
    reflection: "How can I grow without leaving myself behind?",
  },
};

const MOON_LABEL: Record<MoonPhase, string> = {
  new: "new moon",
  crescent: "crescent moon",
  half: "half moon",
  full: "full moon",
};

// ─── Wave rule ────────────────────────────────────────────────────────────────

function WaveRule() {
  return (
    <div className="w-full my-8" aria-hidden="true">
      <svg
        viewBox="0 0 400 16"
        width="100%"
        height="16"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 8 C 66 2, 133 14, 200 8 S 333 2, 400 8"
          stroke="#6B8C9A"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

// ─── Moon symbol ─────────────────────────────────────────────────────────────

function MoonSymbol({ phase }: { phase: MoonPhase }) {
  const uid = useId();
  const maskId = `moon-mask-${uid}`;
  const accent = "#6B8C9A";

  if (phase === "new") {
    return (
      <svg width="25" height="25" viewBox="0 0 20 20" aria-hidden="true">
        <circle
          cx="10" cy="10" r="7"
          stroke={accent}
          strokeWidth="0.75"
          fill="none"
          opacity="0.28"
        />
      </svg>
    );
  }

  if (phase === "crescent") {
    return (
      <svg width="25" height="25" viewBox="0 0 20 20" aria-hidden="true">
        <defs>
          <mask id={maskId}>
            <rect width="20" height="20" fill="white" />
            <circle cx="13" cy="10" r="7" fill="black" />
          </mask>
        </defs>
        <circle
          cx="10" cy="10" r="7"
          fill={accent}
          opacity="0.6"
          mask={`url(#${maskId})`}
        />
      </svg>
    );
  }

  if (phase === "half") {
    return (
      <svg width="25" height="25" viewBox="0 0 20 20" aria-hidden="true">
        {/* left half */}
        <path d="M 10 3 A 7 7 0 0 0 10 17 L 10 3 Z" fill={accent} opacity="0.68" />
        <circle
          cx="10" cy="10" r="7"
          stroke={accent}
          strokeWidth="0.75"
          fill="none"
          opacity="0.28"
        />
      </svg>
    );
  }

  // full
  return (
    <svg width="25" height="25" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7" fill={accent} opacity="0.55" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [season, setSeason]   = useState<Season | null>(null);
  const [journalOpen, setJournalOpen]   = useState(false);
  const [journalText, setJournalText]   = useState("");
  const [journalFlash, setJournalFlash] = useState(false);
  const responseRef = useRef<HTMLElement>(null);

  const compositeKey =
    current && season
      ? `${currentKey[current]}:${seasonKey[season]}`
      : null;

  const response = compositeKey ? (RESPONSES[compositeKey] ?? null) : null;
  const moon     = compositeKey ? (MOON_MAP[compositeKey] ?? "new") : null;

  // Restore session on mount
  useEffect(() => {
    try {
      const c = localStorage.getItem("sc-current");
      const s = localStorage.getItem("sc-season");
      if (c && (currents as string[]).includes(c)) setCurrent(c as Current);
      if (s && (seasons as string[]).includes(s))  setSeason(s as Season);
    } catch {}
  }, []);

  // Load journal entry whenever compositeKey changes
  useEffect(() => {
    setJournalOpen(false);
    setJournalFlash(false);
    if (!compositeKey) { setJournalText(""); return; }
    try {
      const saved = localStorage.getItem(`sc-journal:${compositeKey}`);
      setJournalText(saved ?? "");
    } catch {
      setJournalText("");
    }
  }, [compositeKey]);

  // Auto-scroll response into view
  useEffect(() => {
    if (!response || !responseRef.current) return;
    const t = setTimeout(() => {
      responseRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
    return () => clearTimeout(t);
  }, [compositeKey, response]);

  function handleSetCurrent(c: Current) {
    setCurrent(c);
    try { localStorage.setItem("sc-current", c); } catch {}
  }

  function handleSetSeason(s: Season) {
    setSeason(s);
    try { localStorage.setItem("sc-season", s); } catch {}
  }

  function handleSaveJournal() {
    if (!compositeKey) return;
    try {
      localStorage.setItem(`sc-journal:${compositeKey}`, journalText);
      setJournalFlash(true);
      setTimeout(() => setJournalFlash(false), 1500);
    } catch {}
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-14 max-w-lg mx-auto">

      {/* Header */}
      <header className="text-center mb-2">
        <h1 className="font-serif text-3xl font-light tracking-wide text-[#2B2B2B] mb-3">
          Sacred Currents
        </h1>
        <p className="font-sans text-sm text-[#6F6F6F] leading-relaxed max-w-xs mx-auto">
          A soft place to meet yourself across changing currents and seasons.
        </p>
      </header>

      <WaveRule />

      {/* Current selector */}
      <section className="w-full mb-8">
        <h2 className="font-sans text-xs uppercase tracking-widest text-[#6F6F6F] mb-4">
          How are you feeling?
        </h2>
        <div className="flex flex-col gap-2">
          {currents.map((c) => (
            <button
              key={c}
              onClick={() => handleSetCurrent(c)}
              className={`text-left px-5 py-3 rounded-xl font-sans text-sm transition-all duration-300 ${
                current === c
                  ? "bg-[#2B2B2B] text-[#E6E1D8]"
                  : "bg-[#EDE9E2] text-[#6F6F6F] hover:bg-[#E0DAD0]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Season selector */}
      <section className="w-full mb-10">
        <h2 className="font-sans text-xs uppercase tracking-widest text-[#6F6F6F] mb-4">
          What season are you in?
        </h2>
        <div className="flex flex-col gap-2">
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => handleSetSeason(s)}
              className={`text-left px-5 py-3 rounded-xl font-sans text-sm transition-all duration-300 ${
                season === s
                  ? "bg-[#A9826A] text-white"
                  : "bg-[#EDE9E2] text-[#6F6F6F] hover:bg-[#E0DAD0]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Response card */}
      {response && moon && (
        <section
          key={compositeKey}
          ref={responseRef}
          className="w-full bg-[#1F2327] border border-[#2A2F33] rounded-3xl p-7 space-y-6 animate-fade-in"
        >
          {/* Phrase + Moon */}
          <div className="flex items-start justify-between gap-4">
            <p className="font-serif text-xl font-light text-[#E6E1D8] leading-relaxed italic flex-1">
              &ldquo;{response.phrase}&rdquo;
            </p>
            <div
              className="flex-shrink-0 mt-1"
              title={MOON_LABEL[moon]}
              aria-label={MOON_LABEL[moon]}
            >
              <MoonSymbol phase={moon} />
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-sans text-xs uppercase tracking-widest text-[#6B8C9A] mb-3">
              A few gentle things
            </h3>
            <ul className="space-y-2">
              {response.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-sans text-sm text-[#E6E1D8]"
                >
                  <span className="mt-0.5 text-[#4A6874] select-none">&middot;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Reflection + Journal */}
          <div className="pt-4 border-t border-[#2A2F33] space-y-5">
            <p className="font-serif text-sm text-[#AAB0B4] italic leading-relaxed">
              {response.reflection}
            </p>

            {!journalOpen ? (
              <button
                onClick={() => setJournalOpen(true)}
                className="font-sans text-xs text-[#5A7A88] hover:text-[#6B8C9A] transition-colors duration-300 tracking-wide"
              >
                Write something from here
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="..."
                  rows={4}
                  className="w-full bg-[#161A1D] text-[#E6E1D8] placeholder:text-[#3A4045] border border-[#2A2F33] rounded-xl px-4 py-3 font-sans text-sm resize-none focus:outline-none focus:border-[#4A6874] transition-colors duration-200"
                />
                <div className="flex items-center justify-end gap-4">
                  {journalFlash && (
                    <span className="font-sans text-xs text-[#6B8C9A] transition-opacity duration-500">
                      kept
                    </span>
                  )}
                  <button
                    onClick={handleSaveJournal}
                    className="font-sans text-xs text-[#5A7A88] hover:text-[#8FA7B0] transition-colors duration-300 tracking-wide"
                  >
                    Keep this
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
