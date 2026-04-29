import { NextResponse } from "next/server";
import { getStripImage } from "@/lib/stripCache";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!id || id.length > 64) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const entry = getStripImage(id);
  if (!entry) {
    return NextResponse.json({ error: "Not found or expired" }, { status: 404 });
  }

  const ext = entry.contentType === "image/jpeg" ? "jpg" : entry.contentType.replace("image/", "");
  const filename = `photobooth-strip.${ext}`;

  return new NextResponse(new Uint8Array(entry.buffer), {
    status: 200,
    headers: {
      "Content-Type": entry.contentType,
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
