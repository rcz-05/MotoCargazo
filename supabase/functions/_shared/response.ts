import { corsHeaders } from "./cors.ts";

export function ok<T>(payload: T, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}

export function fail(message: string, status = 400, details?: unknown): Response {
  return new Response(
    JSON.stringify({
      error: message,
      details: details ?? null
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}
