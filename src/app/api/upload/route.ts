import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client inside the handler so it doesn't break Vercel static build
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing");
      return NextResponse.json({ success: false, error: "Configuration de stockage manquante" }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

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
