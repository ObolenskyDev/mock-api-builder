import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring-2 ${className}`}
        {...props}
      />
    </label>
  );
}
