// app/[lang]/filters/filters-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/src/store/store";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FiltersImageTool() {
  const { t } = useLanguageStore();
  const [filterType, setFilterType] = useState("grayscale");
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [sepiaIntensity, setSepiaIntensity] = useState(80);
  const [brightnessValue, setBrightnessValue] = useState(120);
  const [contrastValue, setContrastValue] = useState(110);
  const [saturationValue, setSaturationValue] = useState(130);
  const [hueRotateValue, setHueRotateValue] = useState(0);
  const [blurValue, setBlurValue] = useState(0);
  
  // Helper to generate preview for filters
  const previewRenderer = async (file: File, options: Record<string, any>): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Apply filter based on selected type
          const { filterType, filterIntensity, sepiaIntensity, brightnessValue, 
                  contrastValue, saturationValue, hueRotateValue, blurValue } = options;
          
          if (filterType === 'grayscale') {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const intensity = filterIntensity / 100;
            
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = data[i] * (1 - intensity) + avg * intensity;
              data[i + 1] = data[i + 1] * (1 - intensity) + avg * intensity;
              data[i + 2] = data[i + 2] * (1 - intensity) + avg * intensity;
            }
            
            ctx.putImageData(imageData, 0, 0);
          } 
          else if (filterType === 'sepia') {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const intensity = sepiaIntensity / 100;
            
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              const newR = Math.min(255, (r * (1 - intensity)) + (((r * 0.393) + (g * 0.769) + (b * 0.189)) * intensity));
              const newG = Math.min(255, (g * (1 - intensity)) + (((r * 0.349) + (g * 0.686) + (b * 0.168)) * intensity));
              const newB = Math.min(255, (b * (1 - intensity)) + (((r * 0.272) + (g * 0.534) + (b * 0.131)) * intensity));
              
              data[i] = newR;
              data[i + 1] = newG;
              data[i + 2] = newB;
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          else if (filterType === 'invert') {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const intensity = filterIntensity / 100;
            
            for (let i = 0; i < data.length; i += 4) {
              data[i] = data[i] * (1 - intensity) + (255 - data[i]) * intensity;
              data[i + 1] = data[i + 1] * (1 - intensity) + (255 - data[i + 1]) * intensity;
              data[i + 2] = data[i + 2] * (1 - intensity) + (255 - data[i + 2]) * intensity;
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          else if (filterType === 'custom') {
            // Apply custom adjustments using 2D canvas filter properties
            
            // Create a temporary canvas to apply filters (to avoid compound effects)
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            if (!tempCtx) {
              reject(new Error('Could not get temporary canvas context'));
              return;
            }
            
            // Draw original image
            tempCtx.drawImage(img, 0, 0);
            
            // Apply combined filters
            ctx.filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) hue-rotate(${hueRotateValue}deg) blur(${blurValue}px)`;
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.filter = 'none'; // Reset filter
          }
          
          // Return the filtered image
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image for preview'));
        };
        
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="filter-type">Filter Type</Label>
        <Select 
          value={filterType} 
          onValueChange={(value) => setFilterType(value)}
        >
          <SelectTrigger id="filter-type">
            <SelectValue placeholder="Select a filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grayscale">Grayscale</SelectItem>
            <SelectItem value="sepia">Sepia</SelectItem>
            <SelectItem value="invert">Invert Colors</SelectItem>
            <SelectItem value="custom">Custom Adjustments</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose a filter type or select "Custom Adjustments" to fine-tune your image
        </p>
      </div>
      
      {filterType === 'grayscale' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="filter-intensity">Grayscale Intensity: {filterIntensity}%</Label>
          </div>
          <Slider
            id="filter-intensity"
            min={0}
            max={100}
            step={1}
            value={[filterIntensity]}
            onValueChange={(values) => setFilterIntensity(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            Adjust the intensity of the grayscale effect. 100% is fully grayscale, 0% is the original image.
          </p>
        </div>
      )}
      
      {filterType === 'sepia' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="sepia-intensity">Sepia Intensity: {sepiaIntensity}%</Label>
          </div>
          <Slider
            id="sepia-intensity"
            min={0}
            max={100}
            step={1}
            value={[sepiaIntensity]}
            onValueChange={(values) => setSepiaIntensity(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            Adjust the intensity of the sepia effect. Higher values create a stronger vintage look.
          </p>
        </div>
      )}
      
      {filterType === 'invert' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="invert-intensity">Invert Intensity: {filterIntensity}%</Label>
          </div>
          <Slider
            id="invert-intensity"
            min={0}
            max={100}
            step={1}
            value={[filterIntensity]}
            onValueChange={(values) => setFilterIntensity(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            Adjust the intensity of the invert effect. 100% fully inverts all colors.
          </p>
        </div>
      )}
      
      {filterType === 'custom' && (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Adjustments</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Adjustments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="brightness">Brightness: {brightnessValue}%</Label>
              </div>
              <Slider
                id="brightness"
                min={0}
                max={200}
                step={1}
                value={[brightnessValue]}
                onValueChange={(values) => setBrightnessValue(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                100% is normal brightness. Values above increase brightness, below decrease it.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="contrast">Contrast: {contrastValue}%</Label>
              </div>
              <Slider
                id="contrast"
                min={0}
                max={200}
                step={1}
                value={[contrastValue]}
                onValueChange={(values) => setContrastValue(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                100% is normal contrast. Higher values increase contrast between light and dark areas.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="saturation">Saturation: {saturationValue}%</Label>
              </div>
              <Slider
                id="saturation"
                min={0}
                max={200}
                step={1}
                value={[saturationValue]}
                onValueChange={(values) => setSaturationValue(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                100% is normal saturation. Higher values increase color intensity, 0% removes all color.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="hue-rotate">Hue Rotation: {hueRotateValue}°</Label>
              </div>
              <Slider
                id="hue-rotate"
                min={0}
                max={360}
                step={1}
                value={[hueRotateValue]}
                onValueChange={(values) => setHueRotateValue(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                Shifts all colors in the image. 0° is normal, 180° inverts colors completely.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="blur">Blur: {blurValue}px</Label>
              </div>
              <Slider
                id="blur"
                min={0}
                max={20}
                step={0.5}
                value={[blurValue]}
                onValueChange={(values) => setBlurValue(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                Adds a Gaussian blur to the image. Higher values create more blur.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Apply Image Filters</h1>
        <p className="mt-2 text-muted-foreground">
          Enhance your images with professional filters and color adjustments
        </p>
      </div>
      
      <ImageProcessor
        title="Image Filters Tool"
        description="Upload an image to apply filters and adjustments."
        processEndpoint="image/apply-filters"
        fileTypes={["image/jpeg", "image/png", "image/webp"]}
        processOptions={{ 
          filterType,
          filterIntensity,
          sepiaIntensity,
          brightnessValue,
          contrastValue,
          saturationValue,
          hueRotateValue,
          blurValue
        }}
        renderOptions={renderOptions}
        previewRenderer={previewRenderer}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Available Filters</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Grayscale</h3>
              <p className="text-sm text-muted-foreground">
                Removes color from the image, converting it to shades of gray. Great for creating a classic, timeless look.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Sepia</h3>
              <p className="text-sm text-muted-foreground">
                Adds warm brown tones to create a vintage or antique appearance, similar to old photographs.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Invert</h3>
              <p className="text-sm text-muted-foreground">
                Reverses all colors in the image, creating a negative effect. Useful for artistic purposes or making text more readable.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Custom Adjustments</h3>
              <p className="text-sm text-muted-foreground">
                Fine-tune brightness, contrast, saturation, hue, and blur to create your perfect image.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">When to Use Image Filters</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Enhance photos by adjusting brightness and contrast</li>
              <li>Create artistic effects with sepia or grayscale filters</li>
              <li>Fix issues with over or under-exposed images</li>
              <li>Make images pop by increasing saturation</li>
              <li>Create a specific mood or aesthetic for social media posts</li>
              <li>Prepare images for printing by optimizing their appearance</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Make subtle adjustments for natural-looking improvements</li>
              <li>Increase contrast slightly to make details pop</li>
              <li>When using sepia, try 70-80% intensity for a classic vintage look</li>
              <li>For black and white photos, adjust brightness and contrast after applying grayscale</li>
              <li>Hue rotation can create interesting color shifts for artistic images</li>
              <li>Light blur (1-3px) can smooth skin imperfections in portraits</li>
              <li>Save both the original and filtered versions of important images</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}