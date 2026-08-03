import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Utiliser la clé ANON ou SERVICE_ROLE selon ce qui est dispo
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    // Upload to Supabase Storage bucket named "produits"
    const { data: uploadData, error } = await supabase.storage
      .from("produits")
      .upload(filename, buffer, {
        contentType: file.type || "image/jpeg",
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ success: false, error: "Upload failed on cloud" }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("produits")
      .getPublicUrl(filename);
    
    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
