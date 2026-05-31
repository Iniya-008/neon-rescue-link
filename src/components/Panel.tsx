import type { ReactNode } from "react";

export function Panel({
  title,
  accent = "blue",
  icon,
  children,
  className = "",
  action,
}: {
  title: string;
  accent?: "blue" | "purple" | "pink";
  icon?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  const border =
    accent === "blue"
      ? "neon-border-blue"
      : accent === "purple"
        ? "neon-border-purple"
        : "neon-border-pink";
  const glow =
    accent === "blue"
      ? "text-glow-blue"
      : accent === "purple"
        ? "text-glow-purple"
        : "text-glow-pink";
  return (
    <section className={`glass ${border} rounded-2xl p-5 ${className}`}>
      <header className="flex items-center justify-between mb-4">
        <h2
          className={`text-sm uppercase tracking-[0.3em] font-bold ${glow}`}
        >
          {icon ? <span className="mr-2">{icon}</span> : null}
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}