import { useState, type FormEvent } from "react";

import type { CreateMockDTO, HttpMethod } from "../types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

interface CreateMockFormProps {
  onSubmit: (payload: CreateMockDTO) => Promise<void>;
}

const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function CreateMockForm({ onSubmit }: CreateMockFormProps) {
  const [path, setPath] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ path, method, description });
      setPath("");
      setMethod("GET");
      setDescription("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create mock";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Create New Mock Endpoint">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Path"
          placeholder="users/profile"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          required
        />

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Method</span>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring-2"
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            required
          >
            {methods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            className="min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring-2"
            placeholder="Describe the JSON payload you want to generate"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" loading={loading}>
          {loading ? "Generating..." : "Generate Mock"}
        </Button>
      </form>
    </Card>
  );
}
