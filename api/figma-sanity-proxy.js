// /api/figma-sanity-proxy — pass-through for the Sanity → Figma plugin.
//
// Figma plugin windows have a `null` origin, and Sanity's CORS won't answer
// that. The plugin calls this endpoint instead; we call Sanity server-to-server
// (no CORS involved) and hand the result back with an "anyone may read" header.
//
// Usage: GET /api/figma-sanity-proxy?url=<Sanity query URL or asset URL>
// Locked down so it can't be used as an open relay. It only fetches:
//   - GROQ query URLs for the projects below
//   - those projects' images/files on cdn.sanity.io
//   - external image links, but only if that exact URL is stored in a
//     moodboard in the project (checked against Sanity first)
// Note: Vercel caps responses at ~4.5 MB, so large videos won't pass through.

const ALLOWED_PROJECTS = ["wiymqwkz"];
const LINK_CHECK = {
  project: "wiymqwkz",
  dataset: "production",
  query: 'count(*[_type == "moodboard" && $u in images[].url]) > 0',
};

async function isKnownLink(url) {
  const q = new URL(`https://${LINK_CHECK.project}.apicdn.sanity.io/v2025-02-19/data/query/${LINK_CHECK.dataset}`);
  q.searchParams.set("query", LINK_CHECK.query);
  q.searchParams.set("$u", JSON.stringify(url));
  const res = await fetch(q);
  if (!res.ok) return false;
  return (await res.json()).result === true;
}

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
  const isLink =
    !isQuery && !isAsset && /^https?:$/.test(target.protocol) && (await isKnownLink(target.href));
  if (!(isQuery || isAsset || isLink) || (!isLink && target.protocol !== "https:")) {
    return error(403, "URL not allowed");
  }

  const headers = {};
  const auth = request.headers.get("authorization");
  if (auth && !isLink) headers.Authorization = auth; // never leak the token to other sites
  if (isLink) headers["User-Agent"] = "Mozilla/5.0 (figma-sanity-proxy)";

  try {
    const res = await fetch(target, { headers, redirect: "follow" });
    if (isLink && !(res.headers.get("content-type") || "").startsWith("image/")) {
      return error(415, "Link is not an image");
    }
    const binary = isAsset || isLink;
    return new Response(binary ? await res.arrayBuffer() : await res.text(), {
      status: res.status,
      headers: {
        ...CORS,
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": binary ? "public, max-age=86400" : "no-store",
      },
    });
  } catch (e) {
    return error(502, "Could not reach Sanity: " + e.message);
  }
}
