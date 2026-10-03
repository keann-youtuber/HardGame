export async function onRequestGet(context) {
  const { env } = context;
  let database = "unconfigured";

  if (env.DB) {
    try {
      await env.DB.prepare("SELECT 1").first();
      database = "ok";
    } catch {
      database = "error";
    }
  }

  return Response.json({
    ok: true,
    service: "hardgame-api",
    database,
    timestamp: Date.now()
  });
}
