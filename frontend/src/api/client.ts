import type { CreateMockDTO, CreateMockResponse, MockEndpoint } from "../types";

const API_BASE = "/api/v1/mocks";

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: string };
    return data.detail ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export async function listMocks(): Promise<MockEndpoint[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return (await response.json()) as MockEndpoint[];
}

export async function createMock(payload: CreateMockDTO): Promise<CreateMockResponse> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return (await response.json()) as CreateMockResponse;
}

export async function deleteMock(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

export async function regenerateMock(
  endpoint: MockEndpoint
): Promise<CreateMockResponse> {
  await deleteMock(endpoint.id);
  return createMock({
    path: endpoint.path,
    method: endpoint.method,
    description: endpoint.description
  });
}
