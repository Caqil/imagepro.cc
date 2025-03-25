// app/api/image/jpg-to-png/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import Sharp from 'sharp';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'processed-images');

// Ensure directories exist
async function ensureDirectories() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
    if (!existsSync(OUTPUT_DIR)) {
        await mkdir(OUTPUT_DIR, { recursive: true });
    }
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Verify it's a JPG image
        if (!file.type.match(/^image\/(jpeg|jpg)$/i)) {
            return NextResponse.json(
                { error: 'Only JPG/JPEG files are supported for this conversion' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.jpg`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-converted.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Convert JPG to PNG with sharp
        await Sharp(inputPath)
            .png()
            .toFile(outputPath);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-converted.png`;

        return NextResponse.json({
            success: true,
            message: 'JPG converted to PNG successfully',
            fileUrl,
            filename: `${uniqueId}-converted.png`,
            originalName: file.name.replace(/\.(jpg|jpeg)$/i, '.png')
        });
    } catch (error) {
        console.error('Image conversion error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image conversion',
                success: false
            },
            { status: 500 }
        );
    }
}