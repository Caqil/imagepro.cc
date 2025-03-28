// app/api/file/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

const ALLOWED_FOLDERS = [
  "processed-images"
];

export async function GET(req: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");
    const filename = searchParams.get("filename");

    // Basic validation
    if (!folder || !filename) {
      return NextResponse.json({ 
        error: "Missing required parameters", 
        details: "Both 'folder' and 'filename' parameters are required" 
      }, { status: 400 });
    }

    // Validate folder name
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ 
        error: "Invalid folder", 
        details: `Folder '${folder}' is not allowed. Allowed folders are: ${ALLOWED_FOLDERS.join(", ")}` 
      }, { status: 400 });
    }

    // Security check: prevent path traversal attacks
    const normalizedFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
    if (normalizedFilename !== filename) {
      return NextResponse.json({ 
        error: "Invalid filename", 
        details: "Path traversal is not allowed" 
      }, { status: 400 });
    }

    // Ensure directory exists
    const folderPath = path.join(process.cwd(), "public", folder);
    if (!fs.existsSync(folderPath)) {
      // Create directory if it doesn't exist
      try {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created directory: ${folderPath}`);
      } catch (dirError) {
        console.error(`Failed to create directory ${folderPath}:`, dirError);
      }
    }

    // Full file path
    const filePath = path.join(folderPath, normalizedFilename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json({ 
        error: "File not found", 
        details: `The requested file '${normalizedFilename}' does not exist in folder '${folder}'`
      }, { status: 404 });
    }

    // Get file stats to determine size and MIME type
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return NextResponse.json({ 
        error: "Not a file", 
        details: "The requested path is not a file" 
      }, { status: 400 });
    }

    // Determine content type based on file extension
    let contentType = 'application/octet-stream';
    if (normalizedFilename.endsWith('.jpg') || normalizedFilename.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (normalizedFilename.endsWith('.png')) {
      contentType = 'image/png';
    } else if (normalizedFilename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (normalizedFilename.endsWith('.webp')) {
      contentType = 'image/webp';
    }

    const fileStream = fs.createReadStream(filePath);
    const readableStream = Readable.toWeb(fileStream) as ReadableStream;

    return new Response(readableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${normalizedFilename}"`,
        "Content-Length": stats.size.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error in file API:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}