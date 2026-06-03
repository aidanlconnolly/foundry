/**
 * Tiny markdown renderer for AI chat output — handles headings, bullets,
 * numbered lists, bold, and inline code. Not a full parser; good enough for
 * streamed assistant text without pulling in a dependency.
 */
function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold**, `code`, and [links](url).
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);
  parts.forEach((p, i) => {
    if (!p) return;
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      nodes.push(
        <a
          key={`${keyBase}-${i}`}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-strong underline underline-offset-2"
        >
          {link[1]}
        </a>,
      );
    } else if (p.startsWith("**") && p.endsWith("**")) {
      nodes.push(
        <strong key={`${keyBase}-${i}`} className="font-semibold text-fg">
          {p.slice(2, -2)}
        </strong>,
      );
    } else if (p.startsWith("`") && p.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyBase}-${i}`}
          className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {p.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(p);
    }
  });
  return nodes;
}

export default function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;

  const flush = () => {
    if (list.length && listType) {
      const Tag = listType;
      blocks.push(
        <Tag
          key={`l-${blocks.length}`}
          className={`my-2 ml-5 space-y-1 ${listType === "ul" ? "list-disc" : "list-decimal"}`}
        >
          {list}
        </Tag>,
      );
      list = [];
      listType = null;
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      return;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (h) {
      flush();
      blocks.push(
        <p key={`h-${i}`} className="mt-3 mb-1 font-semibold text-fg">
          {renderInline(h[2], `h-${i}`)}
        </p>,
      );
    } else if (ul) {
      if (listType !== "ul") flush();
      listType = "ul";
      list.push(<li key={`li-${i}`}>{renderInline(ul[1], `li-${i}`)}</li>);
    } else if (ol) {
      if (listType !== "ol") flush();
      listType = "ol";
      list.push(<li key={`li-${i}`}>{renderInline(ol[1], `li-${i}`)}</li>);
    } else {
      flush();
      blocks.push(
        <p key={`p-${i}`} className="my-1.5">
          {renderInline(line, `p-${i}`)}
        </p>,
      );
    }
  });
  flush();

  return <div className="text-sm leading-relaxed text-muted">{blocks}</div>;
}
