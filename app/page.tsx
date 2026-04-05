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
  "overwhelmed:changing":      "crescent",
  "overwhelmed:stuck":         "crescent",
  "overwhelmed:rebuilding":    "crescent",
  "overwhelmed:open":          "half",
  "overwhelmed:tender":        "new",
  "need-grounding:changing":   "crescent",
  "need-grounding:stuck":      "crescent",
  "need-grounding:rebuilding": "crescent",
  "need-grounding:open":       "half",
  "need-grounding:tender":     "new",
  "restless:changing":         "half",
  "restless:stuck":            "half",
  "restless:rebuilding":       "half",
  "restless:open":             "full",
  "restless:tender":           "crescent",
  "seeking-clarity:changing":  "half",
  "seeking-clarity:stuck":     "crescent",
  "seeking-clarity:rebuilding":"half",
  "seeking-clarity:open":      "full",
  "seeking-clarity:tender":    "crescent",
  "ready-to-expand:changing":  "half",
  "ready-to-expand:stuck":     "half",
  "ready-to-expand:rebuilding":"full",
  "ready-to-expand:open":      "full",
  "ready-to-expand:tender":    "half",
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

function MoonSymbol({ phase }: { phase: MoonPhase }) {
  const uid = useId();
  const maskId = `moon-mask-${uid}`;

  if (phase === "new") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="text-stone-400"
      >
        <circle
          cx="10"
          cy="10"
          r="7"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
          opacity="0.3"
        />
      </svg>
    );
  }

  if (phase === "crescent") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="text-stone-500"
      >
        <defs>
          <mask id={maskId}>
            <rect width="20" height="20" fill="white" />
            <circle cx="13" cy="10" r="7" fill="black" />
          </mask>
        </defs>
        <circle
          cx="10"
          cy="10"
          r="7"
          fill="currentColor"
          opacity="0.5"
          mask={`url(#${maskId})`}
        />
      </svg>
    );
  }

  if (phase === "half") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="text-stone-500"
      >
        {/* left half filled */}
        <path
          d="M 10 3 A 7 7 0 0 0 10 17 L 10 3 Z"
          fill="currentColor"
          opacity="0.55"
        />
        <circle
          cx="10"
          cy="10"
          r="7"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
          opacity="0.25"
        />
      </svg>
    );
  }

  // full
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="text-stone-500"
    >
      <circle cx="10" cy="10" r="7" fill="currentColor" opacity="0.45" />
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.12"
      />
    </svg>
  );
}

const MOON_LABEL: Record<MoonPhase, string> = {
  new: "new moon",
  crescent: "crescent moon",
  half: "half moon",
  full: "full moon",
};

export default function Page() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const responseRef = useRef<HTMLElement>(null);

  const compositeKey =
    current && season
      ? `${currentKey[current]}:${seasonKey[season]}`
      : null;

  const response = compositeKey ? RESPONSES[compositeKey] ?? null : null;
  const moon = compositeKey ? MOON_MAP[compositeKey] ?? "new" : null;

  useEffect(() => {
    if (response && responseRef.current) {
      const timeout = setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
      return () => clearTimeout(timeout);
    }
  }, [compositeKey, response]);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-14 max-w-lg mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-light tracking-wide text-stone-700 mb-3">
          Sacred Currents
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed max-w-xs mx-auto">
          A soft place to meet yourself across changing currents and seasons.
        </p>
      </header>

      <section className="w-full mb-8">
        <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">
          How are you feeling?
        </h2>
        <div className="flex flex-col gap-2">
          {currents.map((c) => (
            <button
              key={c}
              onClick={() => setCurrent(c)}
              className={`text-left px-5 py-3 rounded-xl text-sm transition-all duration-300 ${
                current === c
                  ? "bg-stone-700 text-stone-100"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="w-full mb-10">
        <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">
          What season are you in?
        </h2>
        <div className="flex flex-col gap-2">
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`text-left px-5 py-3 rounded-xl text-sm transition-all duration-300 ${
                season === s
                  ? "bg-amber-900/60 text-amber-50"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {response && moon && (
        <section
          key={compositeKey}
          ref={responseRef}
          className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-5 animate-fade-in"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-lg font-light text-stone-700 leading-relaxed italic flex-1">
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

          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-3">
              A few gentle things
            </h3>
            <ul className="space-y-2">
              {response.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-stone-600"
                >
                  <span className="mt-0.5 text-stone-300 select-none">&middot;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-stone-200">
            <p className="text-xs text-stone-400 italic leading-relaxed">
              {response.reflection}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
