import { NextResponse } from "next/server";
import { saveStripImage } from "@/lib/stripCache";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

const MIME_MAP: Record<string, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  webp: "image/webp",
};

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; contentType: string } | null {
  const m = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i.exec(dataUrl.trim());
  if (!m) return null;
  const ext = m[1].toLowerCase();
  const contentType = MIME_MAP[ext];
  if (!contentType) return null;
  try {
    const buf = Buffer.from(m[2], "base64");
    if (buf.length === 0 || buf.length > MAX_IMAGE_BYTES) return null;
    return { buffer: buf, contentType };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("dataUrl" in body)) {
    return NextResponse.json({ error: "Missing dataUrl" }, { status: 400 });
  }

  const dataUrl = (body as { dataUrl: unknown }).dataUrl;
  if (typeof dataUrl !== "string") {
    return NextResponse.json({ error: "dataUrl must be a string" }, { status: 400 });
  }

  const parsed = dataUrlToBuffer(dataUrl);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid or too large image" }, { status: 400 });
  }

  const id = saveStripImage(parsed.buffer, parsed.contentType);
  return NextResponse.json({ id });
}
