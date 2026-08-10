import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { UAParser } from "ua-parser-js";
import { getMongoClient } from "@/lib/mongodb";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "pabbisettyssivakumar@gmail.com";

// In-memory de-duplication: one email per IP per 10 minutes.
// (Resets on each serverless cold start — good enough for a personal portfolio.)
const recentVisits = new Map<string, number>();
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

function isDuplicate(ip: string): boolean {
  const last = recentVisits.get(ip);
  if (last && Date.now() - last < COOLDOWN_MS) return true;
  recentVisits.set(ip, Date.now());
  // Prune old entries to avoid unbounded growth
  if (recentVisits.size > 500) {
    const cutoff = Date.now() - COOLDOWN_MS;
    for (const [key, ts] of recentVisits) {
      if (ts < cutoff) recentVisits.delete(key);
    }
  }
  return false;
}

async function getGeoInfo(ip: string): Promise<{ city: string; country: string; region: string }> {
  // Skip lookup for localhost / private IPs
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip === "unknown"
  ) {
    return { city: "Localhost", country: "Local Dev", region: "" };
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "siva-portfolio-tracker/1.0" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`ipapi status ${res.status}`);
    const data = await res.json();
    return {
      city: data.city ?? "Unknown",
      country: data.country_name ?? "Unknown",
      region: data.region ?? "",
    };
  } catch {
    return { city: "Unknown", country: "Unknown", region: "" };
  }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function formatISTTime(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

export async function POST(req: NextRequest) {
  // Always return 200 immediately — never block the page
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true });
    }
    // Instantiate lazily so missing key at build-time doesn't throw
    const resend = new Resend(process.env.RESEND_API_KEY);

    const ip = getClientIp(req);

    if (isDuplicate(ip)) {
      return NextResponse.json({ ok: true, skipped: "duplicate" });
    }

    // Parse request body (referrer / page URL sent by client)
    let pageUrl = "https://sivakumar.dev";
    let referrer = "Direct";
    try {
      const body = await req.json();
      pageUrl = body.pageUrl ?? pageUrl;
      referrer = body.referrer || "Direct";
    } catch {
      // body optional
    }

    const ua = req.headers.get("user-agent") ?? "";
    const parser = new UAParser(ua);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const browserStr = [browser.name, browser.version].filter(Boolean).join(" ") || "Unknown";
    const osStr = [os.name, os.version].filter(Boolean).join(" ") || "Unknown";
    const deviceType =
      device.type
        ? device.type.charAt(0).toUpperCase() + device.type.slice(1)
        : "Desktop";

    const geo = await getGeoInfo(ip);
    const locationStr = [geo.city, geo.region, geo.country].filter(Boolean).join(", ");
    const timeIST = formatISTTime();

    // Database operations: save visit & calculate total and daily counts
    let totalVisits: number | string = "N/A";
    let visitsToday: number | string = "N/A";

    try {
      const mongoClient = await getMongoClient();
      if (mongoClient) {
        const db = mongoClient.db();
        const visitsCollection = db.collection("visits");

        const now = new Date();
        await visitsCollection.insertOne({
          ip,
          location: geo,
          locationStr,
          device: deviceType,
          browser: browserStr,
          os: osStr,
          pageUrl,
          referrer,
          timestamp: now,
        });

        totalVisits = await visitsCollection.countDocuments();

        // Calculate start of today in IST (UTC+5:30)
        const istOffsetMs = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffsetMs);
        const istYear = istNow.getUTCFullYear();
        const istMonth = istNow.getUTCMonth();
        const istDate = istNow.getUTCDate();
        const startOfDayIst = new Date(Date.UTC(istYear, istMonth, istDate) - istOffsetMs);

        visitsToday = await visitsCollection.countDocuments({
          timestamp: { $gte: startOfDayIst },
        });
      }
    } catch (dbErr) {
      console.error("[visit] database operation failed:", dbErr);
    }

    const subject = `👋 New Portfolio Visit — ${locationStr} (Total: ${totalVisits})`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0b0b0a; color: #d4d0c8; margin: 0; padding: 0; }
    .container { max-width: 520px; margin: 32px auto; background: #111110; border: 1px solid #292524; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #b45309 0%, #d97706 100%); padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 20px; color: #0b0b0a; font-weight: 700; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #44403c; }
    .body { padding: 24px 28px; }
    .stats-card { display: flex; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px; }
    .stat-item { flex: 1; text-align: center; }
    .stat-divider { width: 1px; background: #27272a; margin: 0 12px; }
    .stat-label { font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: .06em; color: #a1a1aa; }
    .stat-value { font-size: 22px; font-weight: 700; color: #f4f4f5; margin-top: 2px; }
    .stat-value.highlight { color: #f59e0b; }
    .row { display: flex; align-items: baseline; gap: 12px; padding: 9px 0; border-bottom: 1px solid #1c1917; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: .06em; color: #78716c; min-width: 80px; }
    .value { font-size: 14px; color: #e7e5e4; font-weight: 500; word-break: break-all; }
    .footer { padding: 14px 28px; background: #0b0b0a; font-size: 11px; color: #44403c; text-align: center; border-top: 1px solid #1c1917; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👋 New Portfolio Visit</h1>
      <p>Someone just landed on sivakumar.dev</p>
    </div>
    <div class="body">
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-label">Total Visits</div>
          <div class="stat-value">${totalVisits}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">Visits Today</div>
          <div class="stat-value highlight">${visitsToday}</div>
        </div>
      </div>
      <div class="row"><span class="label">📍 Location</span><span class="value">${locationStr}</span></div>
      <div class="row"><span class="label">🌐 IP</span><span class="value">${ip}</span></div>
      <div class="row"><span class="label">🖥️ Device</span><span class="value">${deviceType}</span></div>
      <div class="row"><span class="label">🌍 Browser</span><span class="value">${browserStr} on ${osStr}</span></div>
      <div class="row"><span class="label">🔗 Page</span><span class="value">${pageUrl}</span></div>
      <div class="row"><span class="label">↩️ Referrer</span><span class="value">${referrer}</span></div>
      <div class="row"><span class="label">🕐 Time</span><span class="value">${timeIST} IST</span></div>
    </div>
    <div class="footer">sivakumar.dev · visitor notification · auto-generated</div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Portfolio Tracker <notify@sivakumar.dev>",
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    // Swallow all errors — this must never break the page
    console.error("[visit] notification failed:", err);
  }

  return NextResponse.json({ ok: true });
}
