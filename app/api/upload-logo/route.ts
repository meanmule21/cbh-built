import { NextRequest, NextResponse } from "next/server";

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

    // TODO: Upload file to Drupal and save logo record
    // For now, return a placeholder response
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${email.toLowerCase()}/${timestamp}-${safeName}`;

    return NextResponse.json({
      success: true,
      logo: {
        id: `temp-${timestamp}`,
        filename: file.name,
        storage_path: storagePath,
        url: null, // Will be set when Drupal integration is complete
      },
    });
  } catch (error) {
    console.error("Error in upload-logo:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

