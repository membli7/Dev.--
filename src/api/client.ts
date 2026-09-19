/**
 * CodeArcade API Client
 * Uses strictly relative URLs so browser requests naturally proxy through
 * the server without hardcoded hostnames or localhost addresses.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: Array<{ path: string; message: string }>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(endpoint, config);

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch (err) {
    throw new Error(`Server response was not valid JSON [Status ${response.status}]`);
  }

  if (!response.ok || !json.success) {
    const errorMsg = json.error || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    (error as Error & { status: number; details?: unknown }).status = response.status;
    (error as Error & { status: number; details?: unknown }).details = json.details;
    throw error;
  }

  return json.data;
}
