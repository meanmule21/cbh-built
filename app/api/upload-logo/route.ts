import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, getOrCreateCustomer } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const email = formData.get("email") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Get or create customer
    const customer = await getOrCreateCustomer(email);
    const customerId = customer?.id || null;

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${email.toLowerCase()}/${timestamp}-${safeName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Logos")
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Get signed URL (since bucket is private)
    const { data: urlData } = await supabase.storage
      .from("Logos")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365); // 1 year

    // Save to logos table
    const { data: logoRecord, error: dbError } = await supabase
      .from("logos")
      .insert({
        customer_id: customerId,
        email: email.toLowerCase(),
        filename: file.name,
        storage_path: storagePath,
        public_url: urlData?.signedUrl || null,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error saving logo record:", dbError);
      // Still return success since file was uploaded
    }

    return NextResponse.json({
      success: true,
      logo: {
        id: logoRecord?.id,
        filename: file.name,
        storage_path: storagePath,
        url: urlData?.signedUrl,
      },
    });
  } catch (error) {
    console.error("Error in upload-logo:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

