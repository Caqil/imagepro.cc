"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  FileIcon, 
  Cross2Icon, 
  CheckCircledIcon, 
  UploadIcon, 
  DownloadIcon,
  ReloadIcon
} from "@radix-ui/react-icons";
import { AlertCircle, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackgroundRemoverProps {
  title: string;
  description: string;
  processEndpoint: string;
  fileTypes?: string[];
}

export function BackgroundRemover({ 
  title, 
  description, 
  processEndpoint,
  fileTypes = ["image/jpeg", "image/png", "image/webp"],
}: BackgroundRemoverProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedFilename, setProcessedFilename] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const filePreviewUrlRef = useRef<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 
      'image/*': fileTypes.map(type => `.${type.split('/')[1]}`)
    },
    maxSize: 50 * 1024 * 1024,
    maxFiles: 1,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError(rejectedFiles[0].file.size > 50 * 1024 * 1024 
          ? 'File size is too large. Maximum size is 50MB.'
          : 'Please upload a valid image file.');
        return;
      }
      
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];
        if (filePreviewUrlRef.current?.startsWith('blob:')) {
          URL.revokeObjectURL(filePreviewUrlRef.current);
        }
        const previewUrl = URL.createObjectURL(newFile);
        filePreviewUrlRef.current = previewUrl;
        setFile(newFile);
        setFilePreviewUrl(previewUrl);
        setProcessedImageUrl(null);
        setProcessedFilename(null);
        setError(null);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (filePreviewUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(filePreviewUrlRef.current);
      }
      if (processedImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, []);

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleRemoveFile = () => {
    if (filePreviewUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(filePreviewUrlRef.current);
      filePreviewUrlRef.current = null;
    }
    if (processedImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(processedImageUrl);
    }
    setFile(null);
    setFilePreviewUrl(null);
    setProcessedImageUrl(null);
    setProcessedFilename(null);
    setError(null);
  };

  const processImage = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? (clearInterval(progressInterval), 95) : prev + 5));
      }, 200);

      const response = await fetch(`/api/${processEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to process image');

      const data = await response.json();
      setProgress(100);
      setProcessedFilename(data.filename);
      const fileUrl = `/api/file?folder=processed-images&filename=${encodeURIComponent(data.filename)}`;
      setProcessedImageUrl(fileUrl);
      toast.success('Image processed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file && (
          <div 
            {...getRootProps()} 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
              <div className="text-lg font-medium">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Drop your image here or click to browse. Maximum size is 50MB.
              </p>
            </div>
          </div>
        )}
        
        {file && !processedImageUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Image Comparison</h3>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                <Cross2Icon className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 border rounded-md p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Original</p>
                <img 
                  src={filePreviewUrl || ''} 
                  alt="Original" 
                  className="max-w-full max-h-80 object-contain mx-auto"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Processed</p>
                <div className="min-h-80 flex items-center justify-center text-muted-foreground">
                  <p>Click process to see result</p>
                </div>
              </div>
            </div>

            <Button onClick={processImage} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Remove Background'
              )}
            </Button>

            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/10">
              <FileIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">{file?.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file?.size || 0)}</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              Processing image... {progress}%
            </p>
          </div>
        )}
        
        {processedImageUrl && processedFilename && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 border rounded-md p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Original</p>
                <img 
                  src={filePreviewUrl || ''} 
                  alt="Original" 
                  className="max-w-full max-h-80 object-contain mx-auto"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">Processed</p>
                <img 
                  src={processedImageUrl} 
                  alt="Processed" 
                  className="max-w-full max-h-80 object-contain mx-auto"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1" variant="default" asChild>
                <a href={processedImageUrl} download={processedFilename}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
              <Button variant="outline" onClick={handleRemoveFile} className="flex-1">
                Process Another
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}