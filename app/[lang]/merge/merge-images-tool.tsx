"use client";
import React, { useState, useRef } from "react";
import { useLanguageStore } from "@/src/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Check, X, Plus, Download, UploadCloud, Trash2, MoveHorizontal, MoveVertical } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export function MergeImagesTool() {
  const { t } = useLanguageStore();
  const [images, setImages] = useState<{file: File, preview: string, id: string}[]>([]);
  const [mergeDirection, setMergeDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [spacing, setSpacing] = useState(0);
  const [background, setBackground] = useState("#ffffff");
  const [opacity, setOpacity] = useState(100);
  const [isTransparent, setIsTransparent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add images to the list
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).filter(file => file.type.startsWith('image/'));
      
      if (newFiles.length === 0) {
        setError("Please select valid image files (PNG, JPG, WebP)");
        return;
      }
      
      // Limit the total number of images
      if (images.length + newFiles.length > 10) {
        setError("You can only merge up to 10 images at once");
        return;
      }
      
      Promise.all(
        newFiles.map(file => 
          new Promise<{file: File, preview: string, id: string}>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                file,
                preview: reader.result as string,
                id: Math.random().toString(36).substring(2, 9)
              });
            };
            reader.readAsDataURL(file);
          })
        )
      ).then(newImages => {
        setImages(prev => [...prev, ...newImages]);
        setError(null);
      });
    }
    
    // Reset the file input
    if (event.target.value) {
      event.target.value = '';
    }
  };

  // Remove an image from the list
  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  // Move an image up in the list
  const moveImageUp = (index: number) => {
    if (index <= 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImages(newImages);
  };

  // Move an image down in the list
  const moveImageDown = (index: number) => {
    if (index >= images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setImages(newImages);
  };

  // Clear all images
  const clearImages = () => {
    setImages([]);
    setResult(null);
  };

  // Trigger the file input
  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  // Process the images to merge them
  const mergeImages = async () => {
    if (images.length < 2) {
      setError("Please add at least 2 images to merge");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create a FormData object to send to the server
      const formData = new FormData();
      
      // Add each image
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image.file);
      });
      
      // Add settings
      formData.append('direction', mergeDirection);
      formData.append('spacing', spacing.toString());
      formData.append('background', background);
      formData.append('opacity', opacity.toString());
      formData.append('transparent', isTransparent.toString());

      // Send request to the server
      const response = await fetch('/api/image/merge', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to merge images');
      }

      const data = await response.json();
      setResult(data.fileUrl);
      
      toast.success('Images merged successfully', {
        description: 'Your images have been merged. You can now download the result.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to merge images', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Merge Images</h1>
        <p className="mt-2 text-muted-foreground">
          Combine multiple images side by side or vertically into a single image
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side - Image Uploads */}
        <div className="md:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
              />
              
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-primary/50"
                onClick={handleAddClick}
              >
                <UploadCloud className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Click to add images or drag and drop them here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, and WebP (max 10 images)
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddClick();
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Images
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>{images.length} Image{images.length !== 1 ? 's' : ''} Selected</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={clearImages}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto border rounded-md p-2">
                    {images.map((image, index) => (
                      <div key={image.id} className="flex items-center space-x-2 border rounded-md p-2">
                        <img 
                          src={image.preview} 
                          alt={`Preview ${index + 1}`} 
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{image.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(image.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => moveImageUp(index)}
                            disabled={index === 0}
                          >
                            <MoveVertical className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => moveImageDown(index)}
                            disabled={index === images.length - 1}
                          >
                            <MoveHorizontal className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Settings */}
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Merge Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="merge-direction">Merge Direction</Label>
                <Select
                  value={mergeDirection}
                  onValueChange={(value) => setMergeDirection(value as "horizontal" | "vertical")}
                >
                  <SelectTrigger id="merge-direction">
                    <SelectValue placeholder="Select merge direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal (Side by Side)</SelectItem>
                    <SelectItem value="vertical">Vertical (Stacked)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="spacing">Spacing Between Images: {spacing}px</Label>
                </div>
                <Slider
                  id="spacing"
                  min={0}
                  max={50}
                  step={1}
                  value={[spacing]}
                  onValueChange={(values) => setSpacing(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="opacity">Image Opacity: {opacity}%</Label>
                </div>
                <Slider
                  id="opacity"
                  min={10}
                  max={100}
                  step={1}
                  value={[opacity]}
                  onValueChange={(values) => setOpacity(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex gap-2">
                  <div 
                    className={`w-10 h-10 rounded border ${isTransparent ? 'bg-transparent' : ''}`} 
                    style={{ backgroundColor: isTransparent ? 'transparent' : background }}
                  />
                  <Input
                    id="background-color"
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    disabled={isTransparent}
                    className="w-0 opacity-0 absolute"
                  />
                  <Input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="#ffffff"
                    disabled={isTransparent}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="transparent-bg" 
                  checked={isTransparent}
                  onCheckedChange={setIsTransparent}
                />
                <Label htmlFor="transparent-bg">Transparent Background</Label>
              </div>
              
              <Button 
                onClick={mergeImages} 
                disabled={images.length < 2 || isProcessing} 
                className="w-full"
              >
                {isProcessing ? 'Processing...' : 'Merge Images'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Result Section */}
      {result && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Merged Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 flex justify-center bg-muted/30">
                <img 
                  src={result} 
                  alt="Merged Result" 
                  className="max-w-full max-h-96 object-contain"
                />
              </div>
              
              <Button asChild className="w-full">
                <a href={result} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Merged Image
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Information Section */}
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">About Image Merging</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Merging images is useful for creating collages, comparisons, or combined visuals:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Create before/after comparisons by placing images side by side</li>
              <li>Combine product photos into a catalog-style layout</li>
              <li>Build photo collages for social media or presentations</li>
              <li>Stack charts or graphs to create comprehensive visuals</li>
              <li>Create panoramic images by aligning multiple photos</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>For the best quality, use images with similar dimensions when merging horizontally</li>
              <li>When merging vertically, images with the same width work best</li>
              <li>Use transparent background for non-rectangular layouts</li>
              <li>Add spacing between images to create a cleaner separation</li>
              <li>Adjust opacity if you want to create semi-transparent effects</li>
              <li>You can reorder images by using the arrow buttons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}