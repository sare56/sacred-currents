"use client";

import { useState } from "react";

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

interface Response {
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

const responses: Record<string, Response> = {
  "Overwhelmed|Things are changing": {
    phrase: "Things are moving, even if it feels messy.",
    suggestions: [
      "Put one hand on your chest",
      "Take 3 slow breaths",
      "Sip something warm",
    ],
    reflection: "What would feel 5% steadier right now?",
  },
  "Overwhelmed|Tender / sensitive": {
    phrase: "You don\u2019t need to solve this. Just be held.",
    suggestions: [
      "Wrap yourself in something soft",
      "Dim the lights",
      "Breathe gently",
    ],
    reflection: "What would feel comforting, not fixing?",
  },
  "Restless|Feeling stuck": {
    phrase: "Your energy isn\u2019t wrong. It just needs somewhere to go.",
    suggestions: [
      "Change rooms or go outside",
      "Move your body for 2 minutes",
      "Do one small thing",
    ],
    reflection: "What is asking to move through me?",
  },
  "Need Grounding|Things are changing": {
    phrase: "You\u2019re allowed to slow down while everything shifts.",
    suggestions: [
      "Feel your feet on the ground",
      "Name 3 things you can see",
      "Take one steady breath",
    ],
    reflection: "What helps me feel anchored?",
  },
  "Seeking Clarity|Rebuilding": {
    phrase: "Clarity comes softly, not all at once.",
    suggestions: [
      "Write one honest sentence",
      "Clear a small space",
      "Let it be simple",
    ],
    reflection: "What actually matters right now?",
  },
  "Ready to Expand|Open / expanding": {
    phrase: "This is a moment to trust your forward movement.",
    suggestions: [
      "Follow the spark",
      "Say yes to something small",
      "Let it be imperfect",
    ],
    reflection: "Where is life inviting me next?",
  },
};

const fallback: Response = {
  phrase: "You\u2019re exactly where you need to be.",
  suggestions: [
    "Take one slow breath",
    "Notice your body",
    "Stay here for a moment",
  ],
  reflection: "What feels true right now?",
};

export default function Page() {
  const [current, setCurrent] = useState<Current | null>(null);
  const [season, setSeason] = useState<Season | null>(null);

  const responseKey = current && season ? `${current}|${season}` : null;
  const response = responseKey
    ? (responses[responseKey] ?? fallback)
    : null;

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

      {response && (
        <section className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-5 animate-fade-in">
          <p className="text-lg font-light text-stone-700 leading-relaxed italic">
            &ldquo;{response.phrase}&rdquo;
          </p>

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
