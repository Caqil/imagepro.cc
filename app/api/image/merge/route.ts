// app/api/image/merge/route.ts
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

// Convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number; alpha: number } {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse different formats
    let r, g, b;
    if (hex.length === 3) {
        // #RGB format
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        // #RRGGBB format
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        // Default to white if invalid
        r = 255;
        g = 255;
        b = 255;
    }

    return { r, g, b, alpha: 1 };
}

export async function POST(request: NextRequest) {
    try {
        await ensureDirectories();

        // Process form data
        const formData = await request.formData();

        // Extract images
        const files: File[] = [];
        for (let i = 0; i < 20; i++) { // Limit to 20 images max
            const key = `image_${i}`;
            const file = formData.get(key) as File;
            if (!file) break;

            // Verify it's an image file
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: `File ${i + 1} is not a valid image` },
                    { status: 400 }
                );
            }

            files.push(file);
        }

        if (files.length < 2) {
            return NextResponse.json(
                { error: 'At least 2 images are required for merging' },
                { status: 400 }
            );
        }

        // Get merge settings
        const direction = formData.get('direction') as string || 'horizontal';
        const spacing = parseInt(formData.get('spacing') as string) || 0;
        const background = formData.get('background') as string || '#ffffff';
        const opacity = parseInt(formData.get('opacity') as string) || 100;
        const transparent = formData.get('transparent') === 'true';

        // Create unique ID for output
        const uniqueId = uuidv4();
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-merged.png`);

        // Process images one by one
        const processedImages: {
            buffer: Buffer;
            width: number;
            height: number;
            format: string;
        }[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const buffer = Buffer.from(await file.arrayBuffer());
            const tempPath = join(UPLOAD_DIR, `${uniqueId}-temp-${i}.${file.type.split('/')[1]}`);
            await writeFile(tempPath, buffer);

            // Process with Sharp
            let sharpImage = Sharp(tempPath);

            // Apply opacity if needed
            if (opacity < 100) {
                const alpha = opacity / 100;
                sharpImage = sharpImage.composite([{
                    input: Buffer.from([255, 255, 255, Math.round(alpha * 255)]),
                    raw: { width: 1, height: 1, channels: 4 },
                    tile: true,
                    blend: 'dest-in'
                }]);
            }

            // Get metadata and add to processed images
            const metadata = await sharpImage.metadata();
            const processedBuffer = await sharpImage.toBuffer();

            if (!metadata.width || !metadata.height) {
                throw new Error(`Failed to get dimensions for image ${i + 1}`);
            }

            processedImages.push({
                buffer: processedBuffer,
                width: metadata.width,
                height: metadata.height,
                format: metadata.format || 'unknown'
            });
        }

        // Calculate dimensions and create composite
        let compositeWidth = 0;
        let compositeHeight = 0;

        if (direction === 'horizontal') {
            // Total width is sum of all image widths plus spacing
            compositeWidth = processedImages.reduce((sum, img) => sum + img.width, 0) + spacing * (processedImages.length - 1);
            // Height is the max height of all images
            compositeHeight = Math.max(...processedImages.map(img => img.height));
        } else {
            // Total height is sum of all image heights plus spacing
            compositeHeight = processedImages.reduce((sum, img) => sum + img.height, 0) + spacing * (processedImages.length - 1);
            // Width is the max width of all images
            compositeWidth = Math.max(...processedImages.map(img => img.width));
        }

        // Create a new image with the calculated dimensions
        let composite = Sharp({
            create: {
                width: compositeWidth,
                height: compositeHeight,
                channels: 4,
                background: transparent ?
                    { r: 0, g: 0, b: 0, alpha: 0 } :
                    hexToRgb(background)
            }
        });

        // Prepare the composite operations
        const compositeOperations = [];
        let currentX = 0;
        let currentY = 0;

        for (const img of processedImages) {
            compositeOperations.push({
                input: img.buffer,
                left: currentX,
                top: currentY
            });

            // Update position for next image
            if (direction === 'horizontal') {
                currentX += img.width + spacing;
            } else {
                currentY += img.height + spacing;
            }
        }

        // Apply the composite operations
        composite = composite.composite(compositeOperations);

        // Write the final image
        await composite.png().toFile(outputPath);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-merged.png`;

        return NextResponse.json({
            success: true,
            message: 'Images merged successfully',
            fileUrl,
            filename: `${uniqueId}-merged.png`,
            width: compositeWidth,
            height: compositeHeight
        });
    } catch (error) {
        console.error('Image merging error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred while merging images',
                success: false
            },
            { status: 500 }
        );
    }
}