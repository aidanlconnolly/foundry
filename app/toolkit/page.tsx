import { Target, BarChart3, PieChart, Compass } from "lucide-react";
import IdeaScorecard from "@/components/toolkit/IdeaScorecard";
import TamEstimator from "@/components/toolkit/TamEstimator";
import CapTableCalculator from "@/components/toolkit/CapTableCalculator";
import WhichRound from "@/components/toolkit/WhichRound";

const TOOLS = [
  {
    id: "idea-scorecard",
    label: "Idea Scorecard",
    icon: Target,
    blurb:
      "Score an idea on the five dimensions that predict traction, and surface the assumption most likely to kill it.",
  },
  {
    id: "tam",
    label: "TAM Estimator",
    icon: BarChart3,
    blurb: "Size your market bottoms-up — TAM, SAM, and a realistic SOM.",
  },
  {
    id: "cap-table",
    label: "Cap-table / Dilution",
    icon: PieChart,
    blurb:
      "Model how each round dilutes founders, and see where your ownership lands.",
  },
  {
    id: "which-round",
    label: "Which round am I?",
    icon: Compass,
    blurb: "A quick diagnostic for the round that fits where you actually are.",
  },
] as const;

export default function ToolkitPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Toolkit</h1>
        <p className="mt-1 max-w-prose text-muted">
          Interactive models to pressure-test your idea, your market, and your
          cap table. Not financial advice.
        </p>
      </div>

      {/* quick nav */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-fg transition hover:border-border-strong"
            >
              <Icon className="h-4 w-4 text-accent" />
              {t.label}
            </a>
          );
        })}
      </div>

      {TOOLS.map((t) => (
        <section key={t.id} id={t.id} className="scroll-mt-20">
          <div className="mb-3 flex items-center gap-2">
            <t.icon className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-fg">{t.label}</h2>
          </div>
          <p className="mb-3 max-w-prose text-sm text-muted">{t.blurb}</p>
          {t.id === "idea-scorecard" && <IdeaScorecard />}
          {t.id === "tam" && <TamEstimator />}
          {t.id === "cap-table" && <CapTableCalculator />}
          {t.id === "which-round" && <WhichRound />}
        </section>
      ))}
    </div>
  );
}
