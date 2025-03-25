"use client";

import { JSX, useState } from "react";
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FileImage, 
  Palette, 
  Image, 
  Crop, 
  RotateCw, 
  Type, 
  Square, 
  ImagePlus, 
  SlidersHorizontal, 
  Sun, 
  Aperture, 
  CloudOff, 
  Layers, 
  Paintbrush, 
  FileText, 
  Download, 
  ArrowRight, 
  Star,
  PencilRuler,
  Sparkles
} from "lucide-react";
import { MagicWandIcon } from "@radix-ui/react-icons";

export function ImageTools() {
  const { t } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState("popular");
  
  // Tool categories for the tabs
  const toolCategories = [
    {
      id: "popular",
      name: "Popular",
      icon: <Star className="h-5 w-5" />
    },
    {
      id: "conversion",
      name: "Conversion",
      icon: <ArrowRight className="h-5 w-5" />
    },
    {
      id: "editing",
      name: "Editing",
      icon: <PencilRuler className="h-5 w-5" />
    },
    {
      id: "enhancement",
      name: "Enhancement",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: "advanced",
      name: "Advanced",
      icon: <MagicWandIcon className="h-5 w-5" />
    }
  ];

  // Tool definitions
  type Tool = {
    id: string;
    name: string;
    href: string;
    icon: JSX.Element;
    description: string;
    color: string;
    isNew?: boolean;
  };

  type ToolCategories = {
    [key: string]: Tool[];
  };

  const allTools: ToolCategories = {
    popular: [
      {
        id: "make-transparent",
        name: "Make PNG Transparent",
        href: "/make-transparent",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Remove backgrounds by replacing colors with transparency",
        color: "blue"
      },
      {
        id: "png-to-jpg",
        name: "Convert PNG to JPG",
        href: "/png-to-jpg",
        icon: <Image className="h-6 w-6 text-blue-500" />,
        description: "Convert PNG files to JPG format with adjustable quality",
        color: "blue"
      },
      {
        id: "jpg-to-png",
        name: "Convert JPG to PNG",
        href: "/jpg-to-png",
        icon: <Image className="h-6 w-6 text-blue-500" />,
        description: "Convert JPG images to PNG format with transparency support",
        color: "blue"
      },
      {
        id: "change-colors",
        name: "Change Colors",
        href: "/change-colors",
        icon: <Palette className="h-6 w-6 text-purple-500" />,
        description: "Replace specific colors in your PNG images with new colors",
        color: "purple"
      },
      {
        id: "compress-png",
        name: "Compress PNG",
        href: "/compress",
        icon: <Download className="h-6 w-6 text-amber-500" />,
        description: "Reduce PNG file sizes while maintaining quality",
        color: "amber"
      },
      {
        id: "resize",
        name: "Resize Image",
        href: "/resize",
        icon: <Image className="h-6 w-6 text-purple-500" />,
        description: "Resize images to exact dimensions while preserving quality",
        isNew: true,
        color: "purple"
      }
    ],
    conversion: [
      {
        id: "make-transparent",
        name: "Make PNG Transparent",
        href: "/make-transparent",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Remove backgrounds by replacing colors with transparency",
        color: "blue"
      },
      {
        id: "png-to-jpg",
        name: "Convert PNG to JPG",
        href: "/png-to-jpg",
        icon: <Image className="h-6 w-6 text-blue-500" />,
        description: "Convert PNG files to JPG format with adjustable quality",
        color: "blue"
      },
      {
        id: "jpg-to-png",
        name: "Convert JPG to PNG",
        href: "/jpg-to-png",
        icon: <Image className="h-6 w-6 text-blue-500" />,
        description: "Convert JPG images to PNG format with transparency support",
        color: "blue"
      },
      {
        id: "png-to-webp",
        name: "Convert PNG to WebP",
        href: "/png-to-webp",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Convert PNG images to WebP for better web performance",
        color: "blue"
      },
      {
        id: "webp-to-png",
        name: "Convert WebP to PNG",
        href: "/webp-to-png",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Convert WebP images to PNG format for better compatibility",
        color: "blue"
      },
      {
        id: "svg-to-png",
        name: "Convert SVG to PNG",
        href: "/svg-to-png",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Convert vector SVG files to raster PNG images",
        color: "blue"
      },
      {
        id: "png-to-base64",
        name: "Convert PNG to Base64",
        href: "/png-to-base64",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Convert PNG images to base64 encoding for web embedding",
        color: "blue"
      },
      {
        id: "base64-to-png",
        name: "Convert Base64 to PNG",
        href: "/base64-to-png",
        icon: <FileImage className="h-6 w-6 text-blue-500" />,
        description: "Convert base64-encoded image strings back to PNG files",
        color: "blue"
      }
    ],
    editing: [
      {
        id: "change-colors",
        name: "Change Colors",
        href: "/change-colors",
        icon: <Palette className="h-6 w-6 text-purple-500" />,
        description: "Replace specific colors in your PNG images with new colors",
        color: "purple"
      },
      {
        id: "change-tone",
        name: "Change Color Tone",
        href: "/change-tone",
        icon: <Palette className="h-6 w-6 text-purple-500" />,
        description: "Apply color tones and tints to your images for artistic effects",
        color: "purple"
      },
      {
        id: "resize",
        name: "Resize Image",
        href: "/resize",
        icon: <Image className="h-6 w-6 text-purple-500" />,
        description: "Resize images to exact dimensions while preserving quality",
        isNew: true,
        color: "purple"
      },
      {
        id: "crop",
        name: "Crop Image",
        href: "/crop",
        icon: <Crop className="h-6 w-6 text-purple-500" />,
        description: "Crop images to remove unwanted areas and focus on important content",
        isNew: true,
        color: "purple"
      },
      {
        id: "rotate",
        name: "Rotate & Flip",
        href: "/rotate",
        icon: <RotateCw className="h-6 w-6 text-purple-500" />,
        description: "Rotate and flip images to the correct orientation",
        isNew: true,
        color: "purple"
      },
      {
        id: "add-text",
        name: "Add Text to Image",
        href: "/add-text",
        icon: <Type className="h-6 w-6 text-purple-500" />,
        description: "Add custom text, captions, or watermarks to your images",
        isNew: true,
        color: "purple"
      }
    ],
    enhancement: [
      {
        id: "add-noise",
        name: "Add Noise",
        href: "/add-noise",
        icon: <Aperture className="h-6 w-6 text-green-500" />,
        description: "Add film grain or noise effects to your images",
        color: "green"
      },
      {
        id: "add-border",
        name: "Add Border",
        href: "/add-border",
        icon: <Square className="h-6 w-6 text-green-500" />,
        description: "Add custom borders to your images with various styles and colors",
        isNew: true,
        color: "green"
      },
      {
        id: "filters",
        name: "Apply Image Filters",
        href: "/filters",
        icon: <SlidersHorizontal className="h-6 w-6 text-green-500" />,
        description: "Enhance images with professional filters like grayscale, sepia, and more",
        isNew: true,
        color: "green"
      },
      {
        id: "compress-png",
        name: "Compress PNG",
        href: "/compress",
        icon: <Download className="h-6 w-6 text-amber-500" />,
        description: "Reduce PNG file sizes while maintaining quality",
        color: "amber"
      },
      {
        id: "compress-jpg",
        name: "Compress JPG",
        href: "/compress-jpg",
        icon: <Download className="h-6 w-6 text-amber-500" />,
        description: "Optimize JPG images with adjustable quality settings",
        isNew: true,
        color: "amber"
      }
    ],
    advanced: [
      {
        id: "remove-background",
        name: "Remove Background",
        href: "/remove-background",
        icon: <CloudOff className="h-6 w-6 text-indigo-500" />,
        description: "Automatically remove backgrounds from photos and images",
        isNew: true,
        color: "indigo"
      },
      {
        id: "images-to-pdf",
        name: "Images to PDF",
        href: "/images-to-pdf",
        icon: <FileText className="h-6 w-6 text-indigo-500" />,
        description: "Convert multiple images to a single PDF document",
        isNew: true,
        color: "indigo"
      },
      {
        id: "merge-images",
        name: "Merge Images",
        href: "/merge",
        icon: <Layers className="h-6 w-6 text-indigo-500" />,
        description: "Combine multiple images side by side or vertically",
        isNew: true,
        color: "indigo"
      }
    ]
  };

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
          <FileImage className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Image Tools</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Free online tools to convert, edit, enhance, and optimize your images
        </p>
      </div>

      {/* Tools Tabs */}
      <Tabs defaultValue="popular" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-12">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            {toolCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab Content */}
        {Object.keys(allTools).map((category) => (
          <TabsContent key={category} value={category} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTools[category]?.map((tool) => (
                <LanguageLink key={tool.id} href={tool.href} className="block h-full">
                  <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg bg-${tool.color}-100 dark:bg-${tool.color}-900/30`}>
                          {tool.icon}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-bold text-lg">{tool.name}</h3>
                            {tool.isNew && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">{tool.description}</p>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button variant="ghost" className="px-0">
                          Use Tool <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </LanguageLink>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* How to use section */}
      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">How to Use Our Image Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
              1
            </div>
            <h3 className="text-lg font-medium mb-2">Choose a Tool</h3>
            <p className="text-sm text-muted-foreground">
              Select the image tool you need from our comprehensive collection.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
              2
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Your Image</h3>
            <p className="text-sm text-muted-foreground">
              Upload the image you want to process. We support PNG, JPG, and WebP formats.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
              3
            </div>
            <h3 className="text-lg font-medium mb-2">Adjust Settings</h3>
            <p className="text-sm text-muted-foreground">
              Customize the tool's settings according to your needs. Each tool has specific options.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
              4
            </div>
            <h3 className="text-lg font-medium mb-2">Download Result</h3>
            <p className="text-sm text-muted-foreground">
              Process your image and download the result with a single click.
            </p>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-muted/30 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-8">Why Use Our Image Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
              <FileImage className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">100% Free</h3>
            <p className="text-sm text-muted-foreground">
              All our image tools are completely free to use, with no hidden fees or subscriptions.
            </p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
              <CloudOff className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Your images are processed securely in your browser. We don't store or share your files.
            </p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Installation</h3>
            <p className="text-sm text-muted-foreground">
              Use our powerful tools directly in your browser without downloading any software.
            </p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 inline-flex mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">High Quality</h3>
            <p className="text-sm text-muted-foreground">
              Get professional-quality results with our advanced image processing algorithms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}