import { randomBytes } from "crypto";

const TTL_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 80;

type Entry = { buffer: Buffer; expiresAt: number; contentType: string };

const cache = new Map<string, Entry>();

function prune(): void {
  const now = Date.now();
  for (const [id, entry] of cache) {
    if (entry.expiresAt < now) cache.delete(id);
  }
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
    else break;
  }
}

export function saveStripImage(buffer: Buffer, contentType: string): string {
  prune();
  const id = randomBytes(16).toString("base64url");
  cache.set(id, { buffer, expiresAt: Date.now() + TTL_MS, contentType });
  return id;
}

export function getStripImage(id: string): Entry | null {
  const entry = cache.get(id);
  if (!entry || entry.expiresAt < Date.now()) {
    if (entry) cache.delete(id);
    return null;
  }
  return entry;
}
