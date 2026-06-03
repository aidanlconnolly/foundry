import ToolDirectory from "@/components/tools/ToolDirectory";

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Founder Tool Directory
        </h1>
        <p className="mt-1 max-w-prose text-muted">
          The software founders actually use to build and scale — filterable by
          category and the stage to adopt it. Starred picks are safe defaults.
        </p>
      </div>
      <ToolDirectory />
    </div>
  );
}
