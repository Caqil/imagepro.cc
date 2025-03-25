// app/api/image/apply-filters/route.ts
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

        // Get filter parameters
        const filterType = formData.get('filterType') as string || 'grayscale';
        const filterIntensity = parseInt(formData.get('filterIntensity') as string) || 100;
        const sepiaIntensity = parseInt(formData.get('sepiaIntensity') as string) || 80;
        const brightnessValue = parseInt(formData.get('brightnessValue') as string) || 100;
        const contrastValue = parseInt(formData.get('contrastValue') as string) || 100;
        const saturationValue = parseInt(formData.get('saturationValue') as string) || 100;
        const hueRotateValue = parseInt(formData.get('hueRotateValue') as string) || 0;
        const blurValue = parseFloat(formData.get('blurValue') as string) || 0;

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
        const inputExt = file.type.split('/')[1] || 'png';
        const inputPath = join(UPLOAD_DIR, `${uniqueId}-input.${inputExt}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-filtered.${inputExt}`);

        // Write file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Create Sharp instance
        let sharpInstance = Sharp(inputPath);

        // Apply filters based on type
        if (filterType === 'grayscale') {
            if (filterIntensity === 100) {
                sharpInstance = sharpInstance.grayscale();
            } else {
                // For partial grayscale, adjust the overlay's alpha channel
                const intensity = filterIntensity / 100;
        
                // Create grayscale version
                const grayscaleBuffer = await Sharp(inputPath)
                    .grayscale()
                    .ensureAlpha() // Ensure there's an alpha channel
                    .toBuffer();
        
                // Create a new Sharp instance to adjust opacity
                const overlayWithOpacity = await Sharp(grayscaleBuffer)
                    .ensureAlpha()
                    .raw()
                    .toBuffer({ resolveWithObject: true })
                    .then(({ data, info }) => {
                        // Manipulate the alpha channel directly
                        for (let i = 3; i < data.length; i += 4) {
                            data[i] = Math.round(data[i] * intensity); // Adjust alpha based on intensity
                        }
                        return Sharp(data, {
                            raw: {
                                width: info.width,
                                height: info.height,
                                channels: 4,
                            },
                        }).toBuffer();
                    });
        
                // Composite the adjusted overlay with the original image
                sharpInstance = Sharp(inputPath).composite([
                    {
                        input: overlayWithOpacity,
                        blend: 'over',
                        gravity: 'centre',
                    },
                ]);
            }
        }
        else if (filterType === 'sepia') {
            const intensity = sepiaIntensity / 100;
        
            // Create sepia effect
            let sepiaInstance = Sharp(inputPath)
                .modulate({
                    brightness: 1,
                    saturation: 0.7,
                    hue: 0,
                })
                .tint({ r: 240, g: 200, b: 160 });
        
            if (intensity < 1) {
                const sepiaBuffer = await sepiaInstance
                    .ensureAlpha()
                    .toBuffer();
        
                const overlayWithOpacity = await Sharp(sepiaBuffer)
                    .ensureAlpha()
                    .raw()
                    .toBuffer({ resolveWithObject: true })
                    .then(({ data, info }) => {
                        for (let i = 3; i < data.length; i += 4) {
                            data[i] = Math.round(data[i] * intensity);
                        }
                        return Sharp(data, {
                            raw: {
                                width: info.width,
                                height: info.height,
                                channels: 4,
                            },
                        }).toBuffer();
                    });
        
                sharpInstance = Sharp(inputPath).composite([
                    {
                        input: overlayWithOpacity,
                        blend: 'over',
                        gravity: 'centre',
                    },
                ]);
            } else {
                sharpInstance = sepiaInstance;
            }
        }
        else if (filterType === 'invert') {
            if (filterIntensity === 100) {
                sharpInstance = sharpInstance.negate();
            } else {
                // For partial inversion, adjust the overlay's alpha channel
                const intensity = filterIntensity / 100;
        
                // Create inverted version
                const invertedBuffer = await Sharp(inputPath)
                    .negate()
                    .ensureAlpha() // Ensure there's an alpha channel
                    .toBuffer();
        
                // Adjust opacity by manipulating the alpha channel
                const overlayWithOpacity = await Sharp(invertedBuffer)
                    .ensureAlpha()
                    .raw()
                    .toBuffer({ resolveWithObject: true })
                    .then(({ data, info }) => {
                        // Adjust the alpha channel based on intensity
                        for (let i = 3; i < data.length; i += 4) {
                            data[i] = Math.round(data[i] * intensity); // Scale alpha
                        }
                        return Sharp(data, {
                            raw: {
                                width: info.width,
                                height: info.height,
                                channels: 4,
                            },
                        }).toBuffer();
                    });
        
                // Composite the adjusted overlay with the original image
                sharpInstance = Sharp(inputPath).composite([
                    {
                        input: overlayWithOpacity,
                        blend: 'over',
                        gravity: 'centre',
                    },
                ]);
            }
        }
        else if (filterType === 'custom') {
            // Apply custom adjustments using Sharp's modulate

            // Convert percentage values to multipliers for Sharp
            const brightness = brightnessValue / 100;
            const saturation = saturationValue / 100;

            // Apply brightness and saturation adjustments
            sharpInstance = sharpInstance.modulate({
                brightness: brightness,
                saturation: saturation,
                hue: hueRotateValue
            });

            // Apply contrast adjustment
            sharpInstance = sharpInstance.linear(
                contrastValue / 100, // multiply
                0 // offset
            );

            // Apply blur if specified
            if (blurValue > 0) {
                sharpInstance = sharpInstance.blur(blurValue);
            }
        }

        // Save the filtered image
        await sharpInstance.toFile(outputPath);

        // Create response with file info
        const fileUrl = `/processed-images/${uniqueId}-filtered.${inputExt}`;

        return NextResponse.json({
            success: true,
            message: 'Image filter applied successfully',
            fileUrl,
            filename: `${uniqueId}-filtered.${inputExt}`,
            originalName: file.name.replace(/\.[^/.]+$/, `-filtered.${inputExt}`),
            filterType: filterType
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