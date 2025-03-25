import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import Sharp from 'sharp';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'processed-images');

// Adjusted type to simply Buffer
let refinedBuffer: Buffer;

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
        
        // Extract processing options
        const sensitivity = parseInt(formData.get('sensitivity') as string) || 50;
        const refinementLevel = parseInt(formData.get('refinementLevel') as string) || 2;
        const detectionMode = formData.get('detectionMode') as string || 'auto';
        const preserveTransparency = (formData.get('preserveTransparency') as string) !== 'false';
        const refinementColor = formData.get('refinementColor') as string || '#ffffff';
        const removeColor = formData.get('removeColor') as string || '#ffffff';

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Verify it's an image file
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are supported' },
                { status: 400 }
            );
        }

        // Create unique file paths
        const uniqueId = uuidv4();
        const fileExtension = file.type.split('/')[1] || 'png';
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${fileExtension}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-nobg.png`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Process the image based on detection mode
        let processedBuffer: Buffer;
        
        switch (detectionMode) {
            case 'color':
                processedBuffer = await removeBackgroundByColor(
                    inputPath, 
                    removeColor, 
                    sensitivity, 
                    preserveTransparency
                );
                break;
                
            case 'subject':
                processedBuffer = await removeBackgroundBySubject(
                    inputPath, 
                    sensitivity, 
                    preserveTransparency
                );
                break;
                
            case 'auto':
            default:
                processedBuffer = await removeBackgroundAuto(
                    inputPath, 
                    sensitivity, 
                    refinementLevel, 
                    refinementColor, 
                    preserveTransparency
                );
                break;
        }

        // Save the processed image
        await writeFile(outputPath, processedBuffer);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-nobg.png`;

        return NextResponse.json({
            success: true,
            message: 'Background removed successfully',
            fileUrl,
            filename: `${uniqueId}-nobg.png`,
            originalName: file.name.replace(/\.\w+$/, '-nobg.png')
        });
    } catch (error) {
        console.error('Background removal error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during background removal',
                success: false
            },
            { status: 500 }
        );
    }
}

// Convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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

    return { r, g, b };
}

// Color-based background removal
async function removeBackgroundByColor(
    inputPath: string, 
    removeColor: string, 
    sensitivity: number, 
    preserveTransparency: boolean
): Promise<Buffer> {
    // Convert sensitivity to a tolerance value (0-255)
    const tolerance = Math.round((sensitivity / 100) * 150);
    const targetColor = hexToRgb(removeColor) || { r: 255, g: 255, b: 255 };

    // Process the image
    const image = Sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) {
        throw new Error('Unable to read image dimensions');
    }

    // Extract image data
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Skip if pixel is already transparent and we're preserving transparency
        if (preserveTransparency && alpha === 0) continue;

        // Check if pixel color is within tolerance of target color
        if (
            Math.abs(r - targetColor.r) <= tolerance &&
            Math.abs(g - targetColor.g) <= tolerance &&
            Math.abs(b - targetColor.b) <= tolerance
        ) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }

    // Create a new image from the processed data
    return Sharp(data, {
        raw: {
            width,
            height,
            channels: 4
        }
    }).png().toBuffer();
}

// Edge-based automatic background removal
async function removeBackgroundAuto(
    inputPath: string, 
    sensitivity: number, 
    refinementLevel: number,
    refinementColor: string,
    preserveTransparency: boolean
): Promise<Buffer> {
    const image = Sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) {
        throw new Error('Unable to read image dimensions');
    }

    // Step 1: Prepare the image - increase contrast to help with edge detection
    let enhancedImage = await image
        .ensureAlpha()
        .normalize() // Normalize the image to improve contrast
        .modulate({ brightness: 1.0, saturation: 1.2 }) // Slightly increase saturation
        .toBuffer();

    // Step 2: Edge detection using Canny algorithm
    const edgeBuffer = await Sharp(enhancedImage)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { data, info } = edgeBuffer;
    const channels = info.channels;
    const edgeData = Buffer.from(data);

    // Create an edge mask using a simple edge detection algorithm
    const edges = Buffer.alloc(width * height);
    const edgeSensitivity = Math.max(5, 20 - (sensitivity / 10)); // Adjust based on sensitivity
    
    // Simple edge detection
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const pos = (y * width + x) * channels;
            const posLeft = (y * width + (x - 1)) * channels;
            const posRight = (y * width + (x + 1)) * channels;
            const posUp = ((y - 1) * width + x) * channels;
            const posDown = ((y + 1) * width + x) * channels;
            
            // Calculate intensity differences for edge detection
            const diffX = Math.abs(data[pos] - data[posLeft]) + 
                          Math.abs(data[pos + 1] - data[posLeft + 1]) + 
                          Math.abs(data[pos + 2] - data[posLeft + 2]);
            
            const diffY = Math.abs(data[pos] - data[posUp]) + 
                          Math.abs(data[pos + 1] - data[posUp + 1]) + 
                          Math.abs(data[pos + 2] - data[posUp + 2]);
            
            // Edge strength
            const edgeStrength = Math.min(255, diffX + diffY);
            
            // Set edge if the strength exceeds the threshold
            edges[y * width + x] = edgeStrength > edgeSensitivity ? 255 : 0;
        }
    }

    // Step 3: Flood fill from the edges to identify background
    const mask = Buffer.alloc(width * height, 0);
    const queue: { x: number, y: number }[] = [];
    
    // Start flood fill from the edges of the image (common for background)
    for (let y = 0; y < height; y++) {
        queue.push({ x: 0, y });
        queue.push({ x: width - 1, y });
    }
    
    for (let x = 0; x < width; x++) {
        queue.push({ x, y: 0 });
        queue.push({ x, y: height - 1 });
    }
    
    // Flood fill to identify background
    while (queue.length > 0) {
        const { x, y } = queue.shift()!;
        const pos = y * width + x;
        
        if (x < 0 || y < 0 || x >= width || y >= height || mask[pos] === 1 || edges[pos] === 255) {
            continue;
        }
        
        mask[pos] = 1; // Mark as background
        
        // Add neighbors to queue
        queue.push({ x: x + 1, y });
        queue.push({ x: x - 1, y });
        queue.push({ x, y: y + 1 });
        queue.push({ x, y: y - 1 });
    }

    // Step 4: Apply mask to the original image
    const { data: origData } = await Sharp(inputPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    
    // Create a new buffer for the final image
    const resultBuffer = Buffer.from(origData);
    
    // Apply the mask
    for (let i = 0; i < width * height; i++) {
        // If it's background (mask=1) or (preserveTransparency is true and pixel is already transparent)
        if (mask[i] === 1 || (preserveTransparency && origData[i * channels + 3] === 0)) {
            resultBuffer[i * channels + 3] = 0; // Make transparent
        }
    }
    
    // Apply refinement based on the level
    refinedBuffer = resultBuffer; // Assign to the global variable
    if (refinementLevel > 1) {
        // Apply multiple refinement passes based on level
        for (let pass = 0; pass < refinementLevel; pass++) {
            refinedBuffer = await refineEdges(refinedBuffer, width, height, channels, refinementColor);
        }
    }

    // Create the final image
    return Sharp(refinedBuffer, {
        raw: {
            width,
            height,
            channels: 4
        }
    }).png().toBuffer();
}

// Helper function to refine edges
async function refineEdges(
    buffer: Buffer, 
    width: number, 
    height: number, 
    channels: number,
    refinementColor: string
): Promise<Buffer> {
    const refined = Buffer.from(buffer);
    const refinementColorRgb = hexToRgb(refinementColor) || { r: 255, g: 255, b: 255 };
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const pos = (y * width + x) * channels;
            
            // Skip if not at an edge (transparent-opaque boundary)
            const alpha = buffer[pos + 3];
            if (alpha === 0 || alpha === 255) continue;
            
            // Neighbor alpha values
            const alphaUp = buffer[((y - 1) * width + x) * channels + 3];
            const alphaDown = buffer[((y + 1) * width + x) * channels + 3];
            const alphaLeft = buffer[(y * width + (x - 1)) * channels + 3];
            const alphaRight = buffer[(y * width + (x + 1)) * channels + 3];
            
            // Count transparent and opaque neighbors
            const transparentNeighbors = [alphaUp, alphaDown, alphaLeft, alphaRight].filter(a => a < 128).length;
            const opaqueNeighbors = 4 - transparentNeighbors;
            
            // Refinement decision based on neighbor counts
            if (alpha < 128 && opaqueNeighbors >= 3) {
                // Make pixel opaque if mostly surrounded by opaque pixels
                refined[pos] = refinementColorRgb.r;
                refined[pos + 1] = refinementColorRgb.g;
                refined[pos + 2] = refinementColorRgb.b;
                refined[pos + 3] = 255;
            } else if (alpha >= 128 && transparentNeighbors >= 3) {
                // Make pixel transparent if mostly surrounded by transparent pixels
                refined[pos + 3] = 0;
            }
        }
    }
    
    return refined;
}

// Subject-based background removal (simple implementation)
async function removeBackgroundBySubject(
    inputPath: string, 
    sensitivity: number,
    preserveTransparency: boolean
): Promise<Buffer> {
    const image = Sharp(inputPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) {
        throw new Error('Unable to read image dimensions');
    }

    // For subject detection, we'll use a simplified approach:
    // 1. Apply some preprocessing to enhance contrast
    // 2. Detect edges and create a mask
    // 3. Assume the central area of the image is more likely to contain the subject

    // Enhance the image
    const enhancedBuffer = await image
        .ensureAlpha()
        .normalize()
        .modulate({ brightness: 1.1, saturation: 1.3 })
        .sharpen(0.5)
        .toBuffer();

    // Extract raw pixel data
    const { data } = await Sharp(enhancedBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Create a mask that prioritizes the center of the image
    const mask = Buffer.alloc(width * height, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const channels = 4; // RGBA

    // Build a center-weighted mask
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelPos = (y * width + x) * channels;
            
            // Calculate distance from center (normalized 0-1)
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / maxDistance;
            
            // Calculate pixel intensity (grayscale value)
            const intensity = (data[pixelPos] + data[pixelPos + 1] + data[pixelPos + 2]) / 3;
            
            // Alpha value from the original image
            const alpha = data[pixelPos + 3];
            
            // Subject likelihood score (higher = more likely to be subject)
            // This combines center weighting with pixel intensity
            const subjectScore = (1 - distance) * 0.7 + (intensity / 255) * 0.3;
            
            // Adjust threshold based on sensitivity
            const threshold = 0.5 - (sensitivity / 200); // Range: 0.0-0.5
            
            // If score exceeds threshold, consider it part of the subject
            mask[y * width + x] = subjectScore > threshold ? 1 : 0;
            
            // Preserve transparency if needed
            if (preserveTransparency && alpha === 0) {
                mask[y * width + x] = 0;
            }
        }
    }

    // Apply the mask to the original image
    const finalBuffer = Buffer.from(data);
    for (let i = 0; i < width * height; i++) {
        if (mask[i] === 0) {
            finalBuffer[i * channels + 3] = 0; // Make transparent
        }
    }

    // Create the final image
    return Sharp(finalBuffer, {
        raw: {
            width,
            height,
            channels: 4
        }
    }).png().toBuffer();
}