export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface MockEndpoint {
  id: string;
  path: string;
  method: HttpMethod;
  description: string;
  created_at: string;
}

export interface CreateMockDTO {
  path: string;
  method: HttpMethod;
  description: string;
}

export interface CreateMockResponse {
  endpoint: MockEndpoint;
  payload: Record<string, unknown>;
}
