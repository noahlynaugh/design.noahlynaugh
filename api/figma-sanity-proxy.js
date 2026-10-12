// /api/figma-sanity-proxy — pass-through for the Sanity → Figma plugin.
//
// Figma plugin windows have a `null` origin, and Sanity's CORS won't answer
// that. The plugin calls this endpoint instead; we call Sanity server-to-server
// (no CORS involved) and hand the result back with an "anyone may read" header.
//
// Usage: GET /api/figma-sanity-proxy?url=<Sanity query URL or asset URL>
// Locked to the projects below — GROQ query URLs and that project's images/files
// on cdn.sanity.io only — so it can't be used as an open relay.
// Note: Vercel caps responses at ~4.5 MB, so large videos won't pass through.

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
  const isQuery =
    !!host &&
    ALLOWED_PROJECTS.includes(host[1]) &&
    /^\/v[\d-]+\/data\/query\//.test(target.pathname);
  const asset = /^\/(images|files)\/([a-z0-9]+)\//.exec(target.pathname);
  const isAsset =
    target.hostname === "cdn.sanity.io" && !!asset && ALLOWED_PROJECTS.includes(asset[2]);
  if (target.protocol !== "https:" || !(isQuery || isAsset)) {
    return error(403, "URL not allowed");
  }

  const headers = {};
  const auth = request.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  try {
    const res = await fetch(target, { headers });
    return new Response(isAsset ? await res.arrayBuffer() : await res.text(), {
      status: res.status,
      headers: {
        ...CORS,
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": isAsset ? "public, max-age=86400" : "no-store",
      },
    });
  } catch (e) {
    return error(502, "Could not reach Sanity: " + e.message);
  }
}
