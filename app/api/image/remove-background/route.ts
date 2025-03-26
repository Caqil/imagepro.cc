import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process';

// Define directories
const UPLOAD_DIR = join(process.cwd(), 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'processed-images');
const TEMP_DIR = join(process.cwd(), 'temp');

// Ensure directories exist
async function ensureDirectories() {
    const dirs = [UPLOAD_DIR, OUTPUT_DIR, TEMP_DIR];
    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}

// Utility to clean up temporary files
async function cleanupFiles(filePaths: string[]) {
    for (const path of filePaths) {
        try {
            if (existsSync(path)) {
                await unlink(path);
            }
        } catch (error) {
            console.error(`Failed to delete file: ${path}`, error);
        }
    }
}

// Execute Python script with resource limits
function executePythonScript(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Use spawn instead of exec for better resource control
        const python = spawn('python3', [
            // Add resource limiting parameters
            '-m',
            'scripts.remove_bg',  // Using module syntax instead of direct path
            inputPath,
            outputPath
        ], {
            // Use detached: false to allow proper cleanup
            detached: false,
            // Set stdio to pipe for handling streams
            stdio: ['ignore', 'pipe', 'pipe']
        });

        let stdoutData = '';
        let stderrData = '';

        // Collect stdout data
        python.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        // Collect stderr data
        python.stderr.on('data', (data) => {
            stderrData += data.toString();
            console.error(`Python stderr: ${data}`);
        });

        // Handle process completion
        python.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                console.error(`Python process exited with code ${code}`);
                reject(new Error(stderrData || `Process exited with code ${code}`));
            }
        });

        // Handle process errors
        python.on('error', (err) => {
            console.error('Failed to start Python process:', err);
            reject(err);
        });

        // Set a timeout to kill the process if it runs too long
        const timeout = setTimeout(() => {
            python.kill('SIGTERM');
            reject(new Error('Background removal process timed out'));
        }, 30000); // 30 second timeout

        // Clear timeout on process exit
        python.on('exit', () => {
            clearTimeout(timeout);
        });
    });
}

export async function POST(request: NextRequest) {
    const filesToCleanup: string[] = [];

    try {
        await ensureDirectories();

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are supported' },
                { status: 400 }
            );
        }

        // Check file size
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size exceeds the 10MB limit' },
                { status: 400 }
            );
        }

        const uniqueId = uuidv4();
        const fileExtension = file.type.split('/')[1] || 'png';
        const inputPath = join(TEMP_DIR, `${uniqueId}-input.${fileExtension}`);
        const outputPath = join(OUTPUT_DIR, `${uniqueId}-nobg.png`);

        filesToCleanup.push(inputPath); // Add input file to cleanup list

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(inputPath, buffer);

        // Execute the Python script with spawn
        await executePythonScript(inputPath, outputPath);

        const fileUrl = `/processed-images/${uniqueId}-nobg.png`;

        // Clean up temporary input file
        await cleanupFiles(filesToCleanup);

        return NextResponse.json({
            success: true,
            message: 'Background removed successfully',
            fileUrl,
            filename: `${uniqueId}-nobg.png`,
            originalName: file.name.replace(/\.\w+$/, '-nobg.png'),
        });
    } catch (error) {
        // Make sure to clean up any temporary files even if there's an error
        await cleanupFiles(filesToCleanup);

        console.error('Background removal error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unknown error occurred during background removal',
                success: false,
            },
            { status: 500 }
        );
    }
}