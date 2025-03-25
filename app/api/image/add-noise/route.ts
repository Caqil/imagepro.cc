// app/api/image/add-noise/route.ts
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

/**
 * Helper for generating gaussian random values using the Box-Muller transform
 * This produces a normal distribution of random values
 */
function gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Convert [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        // Get noise parameters
        const noiseAmountStr = formData.get('noiseAmount') as string || '30';
        const noiseAmount = parseInt(noiseAmountStr) / 100; // Convert to 0-1 range
        const noiseType = formData.get('noiseType') as string || 'gaussian';
        const monochrome = (formData.get('monochrome') as string) === 'true';

        if (!file) {
            return NextResponse.json(
                { error: 'No PNG file provided' },
                { status: 400 }
            );
        }

        // Verify it's a PNG file
        if (file.type !== 'image/png') {
            return NextResponse.json(
                { error: 'Only PNG files are supported for this operation' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.png`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-noise.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Load the image and add noise
        const image = Sharp(inputPath);
        const metadata = await image.metadata();
        const { width = 0, height = 0 } = metadata;

        // Get image as raw pixel data
        const rawData = await image.raw().toBuffer();
        const channels = metadata.channels || 4;
        const pixelCount = width * height;

        // Create output buffer with same dimensions
        const outputBuffer = Buffer.from(rawData);

        // Apply noise based on type
        if (noiseType === 'gaussian') {
            // Gaussian noise
            for (let i = 0; i < pixelCount; i++) {
                const offset = i * channels;

                // Skip fully transparent pixels (if alpha channel exists)
                if (channels === 4 && rawData[offset + 3] === 0) continue;

                if (monochrome) {
                    // Apply same noise to all channels for monochrome effect
                    const noise = gaussianRandom(0, 255 * noiseAmount);

                    for (let c = 0; c < 3; c++) { // Only apply to RGB, not alpha
                        let newValue = rawData[offset + c] + noise;
                        outputBuffer[offset + c] = Math.max(0, Math.min(255, newValue));
                    }
                } else {
                    // Apply different noise to each channel for color noise
                    for (let c = 0; c < 3; c++) { // Only apply to RGB, not alpha
                        const noise = gaussianRandom(0, 255 * noiseAmount);
                        let newValue = rawData[offset + c] + noise;
                        outputBuffer[offset + c] = Math.max(0, Math.min(255, newValue));
                    }
                }
            }
        } else if (noiseType === 'salt-pepper') {
            // Salt & Pepper noise
            const noiseThreshold = noiseAmount * 0.5; // Half for salt, half for pepper

            for (let i = 0; i < pixelCount; i++) {
                const offset = i * channels;

                // Skip fully transparent pixels (if alpha channel exists)
                if (channels === 4 && rawData[offset + 3] === 0) continue;

                // Random value to decide if we add noise to this pixel
                const r = Math.random();

                if (r < noiseThreshold) {
                    // Add salt (white) or pepper (black)
                    const isSalt = Math.random() > 0.5;
                    const noiseValue = isSalt ? 255 : 0;

                    if (monochrome) {
                        // Set all channels to same value for monochrome
                        outputBuffer[offset] = noiseValue;     // R
                        outputBuffer[offset + 1] = noiseValue; // G
                        outputBuffer[offset + 2] = noiseValue; // B
                    } else {
                        // Randomly choose which channels to affect
                        if (Math.random() < 0.5) outputBuffer[offset] = noiseValue;     // R
                        if (Math.random() < 0.5) outputBuffer[offset + 1] = noiseValue; // G
                        if (Math.random() < 0.5) outputBuffer[offset + 2] = noiseValue; // B
                    }
                }
            }
        }

        // Create new image from the modified buffer
        await Sharp(outputBuffer, {
            raw: {
                width,
                height,
                channels
            }
        }).png().toFile(outputPath);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-noise.png`;

        return NextResponse.json({
            success: true,
            message: 'Noise added to image successfully',
            fileUrl,
            filename: `${uniqueId}-noise.png`,
            originalName: file.name.replace(/\.png$/i, '-noise.png')
        });
    } catch (error) {
        console.error('Image processing error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during image processing',
                success: false
            },
            { status: 500 }
        );
    }
}