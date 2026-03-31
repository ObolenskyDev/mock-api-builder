import { Copy, RefreshCw, Trash2 } from "lucide-react";

import type { MockEndpoint } from "../types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface MockListProps {
  mocks: MockEndpoint[];
  loading: boolean;
  busyId: string | null;
  onDelete: (id: string) => Promise<void>;
  onRegenerate: (endpoint: MockEndpoint) => Promise<void>;
}

export function MockList({ mocks, loading, busyId, onDelete, onRegenerate }: MockListProps) {
  async function copyLink(path: string): Promise<void> {
    const normalizedPath = path.replace(/^\/+/, "");
    const link = `${window.location.origin}/m/${normalizedPath}`;
    await navigator.clipboard.writeText(link);
  }

  return (
    <Card title="Generated Mocks">
      {loading ? <p className="text-sm text-slate-500">Loading mocks...</p> : null}

      {!loading && mocks.length === 0 ? (
        <p className="text-sm text-slate-500">No mocks yet. Create your first endpoint above.</p>
      ) : null}

      <div className="space-y-3">
        {mocks.map((item) => {
          const endpointLink = `${window.location.origin}/m/${item.path.replace(/^\/+/, "")}`;
          const isBusy = busyId === item.id;

          return (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    <span className="mr-2 rounded bg-slate-100 px-2 py-1 text-xs">{item.method}</span>
                    /m/{item.path}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">{endpointLink}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="bg-slate-700 hover:bg-slate-800"
                    onClick={() => {
                      void copyLink(item.path);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    type="button"
                    className="bg-amber-600 hover:bg-amber-700"
                    disabled={isBusy}
                    onClick={() => {
                      void onRegenerate(item);
                    }}
                  >
                    <RefreshCw className={`h-4 w-4 ${isBusy ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isBusy}
                    onClick={() => {
                      void onDelete(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
