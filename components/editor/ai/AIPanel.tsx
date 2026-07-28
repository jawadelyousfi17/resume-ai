"use client";

// The AI Tools tab: a card per whole-document task, and nothing else. Picking
// one opens a dialog that asks whatever it needs, runs, and shows the answer.

import { useMemo, useState } from "react";
import { useResume } from "@/lib/store";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import { AI_TASKS, PANEL_TASKS, TASK_GATE, type AITaskId } from "@/lib/ai/tasks";
import { usePlan } from "@/components/plan/PlanProvider";
import { timelineEntries } from "@/lib/ai/entries";
import { AITaskDialog } from "./AITaskDialog";
import {
  AlignIcon,
  BulbIcon,
  TagIcon,
  TranslateIcon,
} from "@/components/ui/icons";
import {
  MagicIcon as SparklesIcon,
  DesignIcon as WandIcon,
} from "@/components/ui/svg-icons";

/** One glyph per tool card. Lives here rather than in `lib/ai/tasks.ts`, which
 *  the API route imports and which therefore stays free of components. */
const TASK_ICONS: Record<
  AITaskId,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  summary: AlignIcon,
  highlights: WandIcon,
  skills: TagIcon,
  review: BulbIcon,
  translate: TranslateIcon,
  polish: SparklesIcon,
};

export function AIPanel() {
  const { data, guest } = useResume();
  const auth = useAuthDialog();
  const plan = usePlan();
  const [task, setTask] = useState<AITaskId | null>(null);

  const entries = useMemo(() => timelineEntries(data), [data]);

  /** Why a card can't be used yet, or null when it can. */
  const blocked = (which: AITaskId): string | null => {
    if (which === "highlights") {
      if (!entries.length) return "Add a role under Content first.";
      if (!entries.some((e) => e.ready)) {
        return "Write a highlight on an entry first.";
      }
    }
    if (which === "summary" && !data.sections.length) {
      return "Add some experience first — the summary is drawn from it.";
    }
    if (which === "translate" && !data.sections.length) {
      return "There's nothing written here to translate yet.";
    }
    return null;
  };

  // Every tool that calls the model needs an account. The match score doesn't
  // call anything, so a guest gets that much: paste a posting, see where you
  // stand, and only meet the wall at the rewrite.
  if (guest) {
    return (
      <div className="space-y-3">
        <Heading />

        <div className="rounded-2xl bg-panel p-6 text-center shadow-[var(--shadow-panel)]">
          <SparklesIcon className="mx-auto h-6 w-6 text-purple" />
          <h3 className="mt-3 text-[17px] font-extrabold text-ink">
            Sign in to write with AI
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            The writing tools come with an account. The resume you&rsquo;ve
            started comes with you when you sign in.
          </p>
          <button
            type="button"
            onClick={() => auth.open("signup")}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-purple px-4 py-2.5 text-[14.5px] font-bold text-white transition hover:opacity-90"
          >
            Log in or sign up
          </button>
        </div>

        <div className="space-y-3 opacity-50">
          {PANEL_TASKS.map((which) => (
            <TaskCard key={which} task={which} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Heading />

      <div className="space-y-3">
        {PANEL_TASKS.map((which) => (
          <TaskCard
            key={which}
            task={which}
            reason={blocked(which)}
            // The card opens only if the plan covers it. Asked on the click
            // rather than drawn as a locked row: what it does is worth seeing
            // either way, and the answer arrives the moment it's wanted.
            onOpen={() => plan.ask(TASK_GATE[which]) && setTask(which)}
          />
        ))}
      </div>

      <AITaskDialog task={task} onClose={() => setTask(null)} />
    </div>
  );
}

function Heading() {
  return (
    <div className="px-1 pt-1 pb-2">
      <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink">
        What would you like to do?
      </h2>
    </div>
  );
}

/** The whole card is the button — there's one thing to do with it. Without
 *  `onOpen` it renders flat, which is how the guest preview shows them. */
function TaskCard({
  task,
  reason,
  onOpen,
}: {
  task: AITaskId;
  reason?: string | null;
  onOpen?: () => void;
}) {
  const meta = AI_TASKS[task];
  const Icon = TASK_ICONS[task];

  const body = (
    <>
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 shrink-0 text-ink" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-extrabold text-ink">{meta.label}</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
            {meta.blurb}
          </p>
        </div>
      </div>
      {reason && (
        <p className="mt-3 text-[12.5px] font-medium text-ink-faint">
          {reason}
        </p>
      )}
    </>
  );

  if (!onOpen) {
    return (
      <div className="rounded-2xl bg-panel px-5 py-5 shadow-[var(--shadow-panel)]">
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={Boolean(reason)}
      title={reason ?? undefined}
      className="w-full rounded-2xl bg-panel px-5 py-5 text-left shadow-[var(--shadow-panel)] transition hover:-translate-y-px hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[var(--shadow-panel)]"
    >
      {body}
    </button>
  );
}
