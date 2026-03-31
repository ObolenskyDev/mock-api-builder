import { useCallback, useEffect, useState } from "react";

import { createMock, deleteMock, listMocks, regenerateMock } from "../api/client";
import { CreateMockForm } from "../components/CreateMockForm";
import { MockList } from "../components/MockList";
import type { CreateMockDTO, MockEndpoint } from "../types";

export function Dashboard() {
  const [mocks, setMocks] = useState<MockEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const loadMocks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listMocks();
      setMocks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load mocks";
      setPageError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMocks();
  }, [loadMocks]);

  async function handleCreate(payload: CreateMockDTO): Promise<void> {
    const result = await createMock(payload);
    setMocks((prev) => [result.endpoint, ...prev]);
    setPageError(null);
  }

  async function handleDelete(id: string): Promise<void> {
    setBusyId(id);
    try {
      await deleteMock(id);
      setMocks((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete mock";
      setPageError(message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleRegenerate(endpoint: MockEndpoint): Promise<void> {
    setBusyId(endpoint.id);
    try {
      const result = await regenerateMock(endpoint);
      setMocks((prev) =>
        [result.endpoint, ...prev.filter((item) => item.id !== endpoint.id)].sort((a, b) =>
          a.created_at < b.created_at ? 1 : -1
        )
      );
      setPageError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to regenerate mock";
      setPageError(message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">AI-Generated Mock API Builder</h1>
        <p className="text-sm text-slate-600">
          Create and manage dynamic mock endpoints backed by OpenAI, PostgreSQL, and Redis.
        </p>
      </header>

      {pageError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}

      <CreateMockForm onSubmit={handleCreate} />
      <MockList
        mocks={mocks}
        loading={loading}
        busyId={busyId}
        onDelete={handleDelete}
        onRegenerate={handleRegenerate}
      />
    </main>
  );
}
