export type VideoEmbed =
  | { kind: "youtube"; embedUrl: string; originalUrl: string }
  | { kind: "external"; originalUrl: string };

export function toEmbed(url: string): VideoEmbed {
  const youtubeId = extractYoutubeId(url);
  if (youtubeId) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`,
      originalUrl: url,
    };
  }
  return { kind: "external", originalUrl: url };
}

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.slice(7) || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.slice(8) || null;
    }

    return null;
  } catch {
    return null;
  }
}
