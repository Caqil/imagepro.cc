"use client";
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RemoveBackgroundTool() {
  const { t } = useLanguageStore();
  const [sensitivity, setSensitivity] = useState(50); // Default 50%
  const [refinementLevel, setRefinementLevel] = useState(2); // Default medium
  const [detectionMode, setDetectionMode] = useState("auto"); // auto, color, subject
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [refinementColor, setRefinementColor] = useState("#ffffff"); // For manual refinement of edge colors
  const [removeColor, setRemoveColor] = useState("#ffffff"); // For color-based removal

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="detection-mode">Detection Mode</Label>
        <Select value={detectionMode} onValueChange={setDetectionMode}>
          <SelectTrigger id="detection-mode">
            <SelectValue placeholder="Select detection mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Automatic (AI-based)</SelectItem>
            <SelectItem value="color">Color-based Removal</SelectItem>
            <SelectItem value="subject">Subject Detection</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose how to identify the background. Automatic works best for most images.
        </p>
      </div>
      
      {detectionMode === "color" && (
        <div className="space-y-2">
          <Label htmlFor="remove-color">Color to Remove</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="remove-color"
              value={removeColor}
              onChange={(e) => setRemoveColor(e.target.value)}
              className="w-10 h-10"
            />
            <input
              type="text"
              value={removeColor}
              onChange={(e) => setRemoveColor(e.target.value)}
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 border rounded-md"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Select the background color you want to remove. Works best with solid backgrounds.
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="sensitivity">Detection Sensitivity: {sensitivity}%</Label>
        </div>
        <Slider
          id="sensitivity"
          min={1}
          max={100}
          step={1}
          value={[sensitivity]}
          onValueChange={(values) => setSensitivity(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          Higher sensitivity detects more subtle edges but may include unwanted elements.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="refinement-level">Edge Refinement</Label>
        <Select value={refinementLevel.toString()} onValueChange={(value) => setRefinementLevel(parseInt(value))}>
          <SelectTrigger id="refinement-level">
            <SelectValue placeholder="Select refinement level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Low - Faster processing</SelectItem>
            <SelectItem value="2">Medium - Balanced</SelectItem>
            <SelectItem value="3">High - Better edges</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Higher refinement produces smoother edges but takes longer to process.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="refinement-color">Edge Color Refinement</Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="refinement-color"
            value={refinementColor}
            onChange={(e) => setRefinementColor(e.target.value)}
            className="w-10 h-10"
          />
          <input
            type="text"
            value={refinementColor}
            onChange={(e) => setRefinementColor(e.target.value)}
            placeholder="#ffffff"
            className="flex-1 px-3 py-2 border rounded-md"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Choose a color to help refine edge detection. Match the color of complex areas.
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="preserve-transparency" 
          checked={preserveTransparency}
          onCheckedChange={setPreserveTransparency}
        />
        <Label htmlFor="preserve-transparency">Preserve existing transparency</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Keep transparent areas from the original image (recommended for PNG files).
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Remove Image Background</h1>
        <p className="mt-2 text-muted-foreground">
          Automatically remove backgrounds from your images with advanced detection
        </p>
      </div>
      
      <ImageProcessor
        title="Background Remover"
        description="Upload an image to remove its background. Works best with clear subjects and contrasting backgrounds."
        processEndpoint="image/remove-background"
        fileTypes={["image/jpeg", "image/png", "image/webp"]}
        processOptions={{ 
          sensitivity,
          refinementLevel,
          detectionMode,
          preserveTransparency,
          refinementColor,
          removeColor
        }}
        renderOptions={renderOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">How Background Removal Works</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Our background removal tool uses advanced algorithms to identify the foreground subjects in your image:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li><strong>Automatic Mode</strong>: Uses AI-based detection to identify subjects regardless of background complexity</li>
              <li><strong>Color-based Mode</strong>: Removes specific background colors, ideal for images with solid backgrounds</li>
              <li><strong>Subject Detection</strong>: Focuses on detecting common subjects like people, animals, and products</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Common Use Cases</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Product Photography</h3>
              <p className="text-sm text-muted-foreground">
                Create clean, professional product images with transparent backgrounds for e-commerce.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Portrait Photos</h3>
              <p className="text-sm text-muted-foreground">
                Remove backgrounds from portraits for professional headshots or social media profiles.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Design Elements</h3>
              <p className="text-sm text-muted-foreground">
                Isolate objects from photos to use in graphic design, collages, or presentations.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Digital Marketing</h3>
              <p className="text-sm text-muted-foreground">
                Create clean visuals for ads, social media posts, and marketing materials.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Photo Editing</h3>
              <p className="text-sm text-muted-foreground">
                Remove backgrounds to replace them with new scenes or backgrounds.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Logo Creation</h3>
              <p className="text-sm text-muted-foreground">
                Isolate logo elements from backgrounds for transparent logo files.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Use images with good lighting and clear contrast between subject and background</li>
              <li>For complex images, try adjusting the sensitivity and refinement settings</li>
              <li>Color-based removal works best with solid, consistent background colors</li>
              <li>Higher refinement levels produce better results but take longer to process</li>
              <li>Use edge color refinement to help with complex boundaries like hair or fur</li>
              <li>For best quality, use high-resolution images with clear subjects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}