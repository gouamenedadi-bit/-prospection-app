import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Give it a unique name
    const ext = path.extname(file.name);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}${ext}`;
    
    // Save to public/uploads
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
