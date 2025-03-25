"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";
import { 
  FileImage, 
  Palette, 
  Download, 
  ArrowRight, 
  Image, 
  Crop, 
  RotateCw, 
  Aperture,
  SlidersHorizontal,
  FileText,
  Layers,
  CloudOff,
  PenTool,
  Star,
  Sparkles,
  PencilRuler
} from "lucide-react";
import { MagicWandIcon } from "@radix-ui/react-icons";

export function Homepage() {
  const { t } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState("popular");

  // Featured tools - these appear in the hero section
  const featuredTools = [
    {
      id: "make-transparent",
      name: t("imageTools.makeTransparent.title") || "Make PNG Transparent",
      href: "/make-transparent",
      icon: <FileImage className="h-6 w-6 text-blue-500" />,
      description: t("imageTools.makeTransparent.description") || "Replace any color in a PNG file with transparency",
      color: "blue"
    },
    {
      id: "change-colors",
      name: t("imageTools.changeColors.title") || "Change Colors",
      href: "/change-colors",
      icon: <Palette className="h-6 w-6 text-purple-500" />,
      description: t("imageTools.changeColors.description") || "Replace specific colors in your PNG images with new colors",
      color: "purple"
    },
    {
      id: "compress-png",
      name: t("imageTools.compressPng.title") || "Compress PNG",
      href: "/compress",
      icon: <Download className="h-6 w-6 text-amber-500" />,
      description: t("imageTools.compressPng.description") || "Reduce PNG file sizes while maintaining quality",
      color: "amber"
    }
  ];

  // Popular tool categories
  const toolCategories = [
    {
      id: "popular",
      name: t("ui.popular") || "Popular",
      icon: <Star className="h-5 w-5" />
    },
    {
      id: "conversion",
      name: t("imageTools.categories.conversion") || "Conversion",
      icon: <ArrowRight className="h-5 w-5" />
    },
    {
      id: "editing",
      name: t("imageTools.categories.editing") || "Editing",
      icon: <PencilRuler className="h-5 w-5" />
    },
    {
      id: "enhancement",
      name: t("imageTools.categories.enhancement") || "Enhancement",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: "advanced",
      name: t("imageTools.categories.advanced") || "Advanced",
      icon: <MagicWandIcon className="h-5 w-5" />
    }
  ];

  // All tools organized by category
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
        name: t("imageTools.makeTransparent.title") || "Make PNG Transparent",
        href: "/make-transparent",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.makeTransparent.description") || "Remove backgrounds by replacing colors with transparency",
        color: "blue"
      },
      {
        id: "png-to-jpg",
        name: t("imageTools.pngToJpg.title") || "Convert PNG to JPG",
        href: "/png-to-jpg",
        icon: <Image className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.pngToJpg.description") || "Convert PNG files to JPG format with adjustable quality",
        color: "blue"
      },
      {
        id: "jpg-to-png",
        name: t("imageTools.jpgToPng.title") || "Convert JPG to PNG",
        href: "/jpg-to-png",
        icon: <Image className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.jpgToPng.description") || "Convert JPG images to PNG format with transparency support",
        color: "blue"
      },
      {
        id: "change-colors",
        name: t("imageTools.changeColors.title") || "Change Colors",
        href: "/change-colors",
        icon: <Palette className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.changeColors.description") || "Replace specific colors in your PNG images with new colors",
        color: "purple"
      },
      {
        id: "compress-png",
        name: t("imageTools.compressPng.title") || "Compress PNG",
        href: "/compress",
        icon: <Download className="h-5 w-5 text-amber-500" />,
        description: t("imageTools.compressPng.description") || "Reduce PNG file sizes while maintaining quality",
        color: "amber"
      },
      {
        id: "resize",
        name: t("imageTools.resize.title") || "Resize Image",
        href: "/resize",
        icon: <Image className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.resize.description") || "Resize images to exact dimensions while preserving quality",
        isNew: true,
        color: "purple"
      }
    ],
    conversion: [
      {
        id: "make-transparent",
        name: t("imageTools.makeTransparent.title") || "Make PNG Transparent",
        href: "/make-transparent",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.makeTransparent.description") || "Remove backgrounds by replacing colors with transparency",
        color: "blue"
      },
      {
        id: "png-to-jpg",
        name: t("imageTools.pngToJpg.title") || "Convert PNG to JPG",
        href: "/png-to-jpg",
        icon: <Image className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.pngToJpg.description") || "Convert PNG files to JPG format with adjustable quality",
        color: "blue"
      },
      {
        id: "jpg-to-png",
        name: t("imageTools.jpgToPng.title") || "Convert JPG to PNG",
        href: "/jpg-to-png",
        icon: <Image className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.jpgToPng.description") || "Convert JPG images to PNG format with transparency support",
        color: "blue"
      },
      {
        id: "png-to-webp",
        name: t("imageTools.pngToWebp.title") || "Convert PNG to WebP",
        href: "/png-to-webp",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.pngToWebp.description") || "Convert PNG images to WebP for better web performance",
        color: "blue"
      },
      {
        id: "webp-to-png",
        name: t("imageTools.webpToPng.title") || "Convert WebP to PNG",
        href: "/webp-to-png",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.webpToPng.description") || "Convert WebP images to PNG format for better compatibility",
        color: "blue"
      },
      {
        id: "svg-to-png",
        name: t("imageTools.svgToPng.title") || "Convert SVG to PNG",
        href: "/svg-to-png",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.svgToPng.description") || "Convert vector SVG files to raster PNG images",
        color: "blue"
      },
      {
        id: "png-to-base64",
        name: t("imageTools.pngToBase64.title") || "Convert PNG to Base64",
        href: "/png-to-base64",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.pngToBase64.description") || "Convert PNG images to base64 encoding for web embedding",
        color: "blue"
      },
      {
        id: "base64-to-png",
        name: t("imageTools.base64ToPng.title") || "Convert Base64 to PNG",
        href: "/base64-to-png",
        icon: <FileImage className="h-5 w-5 text-blue-500" />,
        description: t("imageTools.base64ToPng.description") || "Convert base64-encoded image strings back to PNG files",
        color: "blue"
      }
    ],
    editing: [
      {
        id: "change-colors",
        name: t("imageTools.changeColors.title") || "Change Colors",
        href: "/change-colors",
        icon: <Palette className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.changeColors.description") || "Replace specific colors in your PNG images with new colors",
        color: "purple"
      },
      {
        id: "change-tone",
        name: t("imageTools.changeTone.title") || "Change Color Tone",
        href: "/change-tone",
        icon: <Palette className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.changeTone.description") || "Apply color tones and tints to your images for artistic effects",
        color: "purple"
      },
      {
        id: "resize",
        name: t("imageTools.resize.title") || "Resize Image",
        href: "/resize",
        icon: <Image className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.resize.description") || "Resize images to exact dimensions while preserving quality",
        isNew: true,
        color: "purple"
      },
      {
        id: "crop",
        name: t("imageTools.crop.title") || "Crop Image",
        href: "/crop",
        icon: <Crop className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.crop.description") || "Crop images to remove unwanted areas and focus on important content",
        isNew: true,
        color: "purple"
      },
      {
        id: "rotate",
        name: t("imageTools.rotate.title") || "Rotate & Flip",
        href: "/rotate",
        icon: <RotateCw className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.rotate.description") || "Rotate and flip images to the correct orientation",
        isNew: true,
        color: "purple"
      },
      {
        id: "add-text",
        name: t("imageTools.addText.title") || "Add Text to Image",
        href: "/add-text",
        icon: <PenTool className="h-5 w-5 text-purple-500" />,
        description: t("imageTools.addText.description") || "Add custom text, captions, or watermarks to your images",
        isNew: true,
        color: "purple"
      }
    ],
    enhancement: [
      {
        id: "add-noise",
        name: t("imageTools.noise.title") || "Add Noise",
        href: "/add-noise",
        icon: <Aperture className="h-5 w-5 text-green-500" />,
        description: t("imageTools.noise.description") || "Add film grain or noise effects to your images",
        color: "green"
      },
      {
        id: "add-border",
        name: t("imageTools.addBorder.title") || "Add Border",
        href: "/add-border",
        icon: <Crop className="h-5 w-5 text-green-500" />,
        description: t("imageTools.addBorder.description") || "Add custom borders to your images with various styles and colors",
        isNew: true,
        color: "green"
      },
      {
        id: "filters",
        name: t("imageTools.filters.title") || "Apply Image Filters",
        href: "/filters",
        icon: <SlidersHorizontal className="h-5 w-5 text-green-500" />,
        description: t("imageTools.filters.description") || "Enhance images with professional filters like grayscale, sepia, and more",
        isNew: true,
        color: "green"
      },
      {
        id: "compress-png",
        name: t("imageTools.compressPng.title") || "Compress PNG",
        href: "/compress",
        icon: <Download className="h-5 w-5 text-amber-500" />,
        description: t("imageTools.compressPng.description") || "Reduce PNG file sizes while maintaining quality",
        color: "amber"
      },
      {
        id: "compress-jpg",
        name: t("imageTools.compressJpg.title") || "Compress JPG",
        href: "/compress-jpg",
        icon: <Download className="h-5 w-5 text-amber-500" />,
        description: t("imageTools.compressJpg.description") || "Optimize JPG images with adjustable quality settings",
        isNew: true,
        color: "amber"
      }
    ],
    advanced: [
      {
        id: "remove-background",
        name: t("imageTools.removeBackground.title") || "Remove Background",
        href: "/remove-background",
        icon: <CloudOff className="h-5 w-5 text-indigo-500" />,
        description: t("imageTools.removeBackground.description") || "Automatically remove backgrounds from photos and images",
        isNew: true,
        color: "indigo"
      },
      {
        id: "images-to-pdf",
        name: t("imageTools.imagesToPdf.title") || "Images to PDF",
        href: "/images-to-pdf",
        icon: <FileText className="h-5 w-5 text-indigo-500" />,
        description: t("imageTools.imagesToPdf.description") || "Convert multiple images to a single PDF document",
        isNew: true,
        color: "indigo"
      },
      {
        id: "merge-images",
        name: t("imageTools.mergeImages.title") || "Merge Images",
        href: "/merge",
        icon: <Layers className="h-5 w-5 text-indigo-500" />,
        description: t("imageTools.mergeImages.description") || "Combine multiple images side by side or vertically",
        isNew: true,
        color: "indigo"
      }
    ]
  };

  // Features list for the Features section
  const features = [
    {
      icon: <Sparkles className="h-7 w-7 text-primary" />,
      title: "Easy to Use",
      description: "Our intuitive interface makes image editing simple - no design skills required."
    },
    {
      icon: <CloudOff className="h-7 w-7 text-primary" />,
      title: "Privacy First",
      description: "Your images are processed in your browser. We don't store or share your files."
    },
    {
      icon: <Download className="h-7 w-7 text-primary" />,
      title: "Fast Processing",
      description: "Advanced algorithms ensure quick processing even for large images."
    },
    {
      icon: <Image className="h-7 w-7 text-primary" />,
      title: "High Quality Results",
      description: "Get professional-quality image editing without quality loss."
    }
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Choose a Tool",
      description: "Select the image tool you need from our wide range of options."
    },
    {
      number: "02",
      title: "Upload Your Image",
      description: "Upload the image you want to process. We support PNG, JPG, WebP and SVG files."
    },
    {
      number: "03",
      title: "Adjust Settings",
      description: "Customize the tool settings according to your specific needs."
    },
    {
      number: "04",
      title: "Download Result",
      description: "Process your image and download the result with a single click."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Professional Image Tools, <br />
                <span className="text-primary">Completely Free</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Transform your images in seconds with our powerful online tools. No downloads required.
              </p>
            </div>
            <div className="space-x-4">
              <LanguageLink href="/image-tools">
                <Button size="lg" className="font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </LanguageLink>
              <LanguageLink href="#features">
                <Button variant="outline" size="lg" className="font-medium">
                  Learn More
                </Button>
              </LanguageLink>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-12 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Popular Image Tools
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
                Transform your images for any project with our most-used tools.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {featuredTools.map((tool) => (
              <LanguageLink key={tool.id} href={tool.href} className="block h-full">
                <Card className="p-6 h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <div className={`mb-4 p-2 w-fit rounded-lg bg-${tool.color}-100 dark:bg-${tool.color}-900/20`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{tool.description}</p>
                  </div>
                  <Button variant="ghost" className="mt-4 justify-start px-0">
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </LanguageLink>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                All Image Tools
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
                Explore our complete set of image processing and editing tools.
              </p>
            </div>
          </div>

          <Tabs defaultValue="popular" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
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

            {Object.keys(allTools).map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allTools[category]?.map((tool) => (
                    <LanguageLink key={tool.id} href={tool.href} className="block h-full">
                      <div className={`p-4 rounded-lg border border-${tool.color}-200/20 hover:border-${tool.color}-300/30 dark:border-${tool.color}-800/20 dark:hover:border-${tool.color}-700/30 transition-all duration-200 hover:shadow-sm h-full`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${tool.color}-100 dark:bg-${tool.color}-900/20`}>
                            {tool.icon}
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {tool.name}
                              {tool.isNew && (
                                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </LanguageLink>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why Choose Our Image Tools
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
                Powerful tools that make image editing simple for everyone.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10 mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
                Transform your images in just a few simple steps.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-primary/20" style={{ width: 'calc(100% - 3rem)', transform: 'translateX(1.5rem)' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Transform Your Images?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
                Start using our free image tools today - no registration required.
              </p>
            </div>
            <div className="space-x-4 mt-4">
              <LanguageLink href="/image-tools">
                <Button size="lg" className="font-medium">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </LanguageLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}