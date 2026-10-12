// /api/figma-sanity-proxy — pass-through for the Sanity → Figma plugin.
//
// Figma plugin windows have a `null` origin, and Sanity's CORS won't answer
// that. The plugin calls this endpoint instead; we call Sanity server-to-server
// (no CORS involved) and hand the result back with an "anyone may read" header.
//
// Usage: GET /api/figma-sanity-proxy?url=<full Sanity query URL>
// Locked to the projects below and to GROQ query URLs only, so it can't be used
// as an open relay.

const ALLOWED_PROJECTS = ["wiymqwkz"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization",
};

function error(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request) {
  let target;
  try {
    target = new URL(new URL(request.url).searchParams.get("url"));
  } catch {
    return error(400, "Missing or invalid ?url=");
  }

  const host = /^([a-z0-9]+)\.(api|apicdn)\.sanity\.io$/.exec(target.hostname);
  if (
    target.protocol !== "https:" ||
    !host ||
    !ALLOWED_PROJECTS.includes(host[1]) ||
    !/^\/v[\d-]+\/data\/query\//.test(target.pathname)
  ) {
    return error(403, "URL not allowed");
  }

  const headers = {};
  const auth = request.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  try {
    const res = await fetch(target, { headers });
    return new Response(await res.text(), {
      status: res.status,
      headers: {
        ...CORS,
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return error(502, "Could not reach Sanity: " + e.message);
  }
}
