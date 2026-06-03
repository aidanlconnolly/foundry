import { getThreads, getThreadMessages } from "@/lib/actions/mentor";
import MentorChat from "@/components/mentor/MentorChat";

export const dynamic = "force-dynamic";

export default async function MentorPage() {
  const threads = await getThreads();
  const initialThreadId = threads[0]?.id;
  const initialMessages = initialThreadId
    ? (await getThreadMessages(initialThreadId)).map((m) => ({
        role: m.role,
        content: m.content,
      }))
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          AI Mentor
        </h1>
        <p className="mt-1 text-sm text-muted">
          A context-aware tutor that knows where you are on the path.
        </p>
      </div>
      <MentorChat
        threads={threads}
        initialThreadId={initialThreadId}
        initialMessages={initialMessages}
      />
    </div>
  );
}
