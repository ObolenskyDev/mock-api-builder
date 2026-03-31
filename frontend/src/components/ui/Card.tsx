import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {title ? <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2> : null}
      {children}
    </section>
  );
}
