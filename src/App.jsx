import { useState } from "react";
import Hero from "./components/Hero";
import ProgressTrack from "./components/ProgressTrack";
import Question from "./components/Question";
import Transition from "./components/Transition";
import EmailGate from "./components/EmailGate";
import Results from "./components/Results";
import { ACCESS_QUESTIONS, REALITY_QUESTIONS, REFLECTION_QUESTIONS } from "./content";
import { diagnose } from "./diagnose";

// Build the full step sequence once.
const STEPS = [
  { type: "intro" },
  ...ACCESS_QUESTIONS.map((q) => ({ type: "q", q })),
  { type: "transition", stage: "reality" },
  ...REALITY_QUESTIONS.map((q) => ({ type: "q", q })),
  { type: "transition", stage: "align" },
  ...REFLECTION_QUESTIONS.map((q) => ({ type: "q", q })),
  { type: "email" },
  { type: "result" },
];

const TOTAL_QUESTIONS =
  ACCESS_QUESTIONS.length + REALITY_QUESTIONS.length + REFLECTION_QUESTIONS.length;

// Calls the /api/subscribe serverless function (see api/subscribe.js),
// which is the only place the real Mailchimp API key lives. If the
// request fails for any reason, we log it but still let the user see
// their results — a failed list signup shouldn't block someone from
// getting the diagnosis they just spent time answering for.
async function captureEmail(email, answers, diagnosis) {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, answers, diagnosis }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Mailchimp subscribe failed:", data.error || res.statusText);
    }
  } catch (err) {
    console.error("Mailchimp subscribe request failed:", err);
  }
}

export default function App() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const step = STEPS[idx];

  function next() {
    setIdx((i) => Math.min(i + 1, STEPS.length - 1));
  }
  function back() {
    setIdx((i) => Math.max(i - 1, 0));
  }
  function answer(key, val) {
    setAnswers((a) => ({ ...a, [key]: val }));
  }
  function restart() {
    setAnswers({});
    setEmail(null);
    setDiagnosis(null);
    setIdx(0);
  }
  async function handleEmailSubmit(submittedEmail) {
    setEmail(submittedEmail);
    const result = diagnose(answers);
    setDiagnosis(result);
    await captureEmail(submittedEmail, answers, result);
    next();
  }

  const questionsAnsweredSoFar = STEPS.slice(0, idx).filter((s) => s.type === "q").length;

  return (
    <div style={{ minHeight: "100vh" }}>
      {idx === 0 && <Hero onStart={next} />}

      {idx !== 0 && (
        <main style={pageStyles.main}>
          {step.type === "q" && (
            <>
              <ProgressTrack total={TOTAL_QUESTIONS} done={questionsAnsweredSoFar} />
              <Question
                question={step.q}
                value={answers[step.q.key]}
                onAnswer={(v) => answer(step.q.key, v)}
                onBack={back}
                onNext={next}
                canBack={idx > 1}
              />
            </>
          )}

          {step.type === "transition" && <Transition stage={step.stage} onNext={next} />}

          {step.type === "email" && <EmailGate onSubmit={handleEmailSubmit} />}

          {step.type === "result" && diagnosis && (
            <Results diagnosis={diagnosis} onRestart={restart} />
          )}
        </main>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:focus-visible, input:focus-visible, a:focus-visible {
          outline: 2px solid var(--clay);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

const pageStyles = {
  main: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "3rem 1.5rem 5rem",
  },
};
