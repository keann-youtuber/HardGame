export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      let database = "unconfigured";
      if (env.DB) {
        try { await env.DB.prepare("SELECT 1").first(); database = "ok"; }
        catch { database = "error"; }
      }
      return Response.json({
        ok: true,
        service: "hardgame",
        database,
        timestamp: Date.now()
      });
    }

    if (url.pathname === "/api/player") {
      const userId = request.headers.get("X-HardGame-User");
      if (!userId) return Response.json({ error: "missing_user" }, { status: 401 });
      if (!env.DB) return Response.json({ error: "database_unconfigured" }, { status: 503 });

      if (request.method === "GET") {
        const character = await env.DB.prepare(
          "SELECT * FROM characters WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1"
        ).bind(userId).first();

        if (!character) return Response.json({ character: null });

        const inventory = await env.DB.prepare(
          "SELECT item_id, quantity FROM inventory WHERE character_id = ?"
        ).bind(character.id).all();

        const equipment = await env.DB.prepare(
          "SELECT slot, item_id FROM equipment WHERE character_id = ?"
        ).bind(character.id).all();

        return Response.json({
          character,
          inventory: inventory.results ?? [],
          equipment: equipment.results ?? []
        });
      }

      if (request.method === "POST") {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object")
          return Response.json({ error: "invalid_body" }, { status: 400 });

        const now = Date.now();
        const id = String(body.id || crypto.randomUUID());

        const existingUser = await env.DB.prepare(
          "SELECT id FROM users WHERE id = ?"
        ).bind(userId).first();

        if (!existingUser) {
          await env.DB.prepare(
            "INSERT INTO users (id, provider, provider_id, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
          ).bind(userId, "local", userId, String(body.displayName || "Player"), now, now).run();
        }

        await env.DB.prepare(
          `INSERT INTO characters
            (id,user_id,name,level,xp,gold,hp,max_hp,mana,max_mana,aura,max_aura,x,y,world_seed,created_at,updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET
             name=excluded.name, level=excluded.level, xp=excluded.xp, gold=excluded.gold,
             hp=excluded.hp, max_hp=excluded.max_hp, mana=excluded.mana, max_mana=excluded.max_mana,
             aura=excluded.aura, max_aura=excluded.max_aura, x=excluded.x, y=excluded.y,
             world_seed=excluded.world_seed, updated_at=excluded.updated_at`
        ).bind(
          id, userId, String(body.name || "Wanderer"),
          Math.max(1, Number(body.level) || 1),
          Math.max(0, Number(body.xp) || 0),
          Math.max(0, Number(body.gold) || 0),
          Math.max(0, Number(body.hp) || 0),
          Math.max(1, Number(body.maxHp) || 100),
          Math.max(0, Number(body.mana) || 0),
          Math.max(1, Number(body.maxMana) || 100),
          Math.max(0, Number(body.aura) || 0),
          Math.max(1, Number(body.maxAura) || 100),
          Number(body.x) || 0, Number(body.y) || 0,
          String(body.worldSeed || "hardgame"),
          now, now
        ).run();

        return Response.json({ ok: true, characterId: id });
      }
    }

    return env.ASSETS.fetch(request);
  }
};