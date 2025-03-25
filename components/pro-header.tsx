"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  HamburgerMenuIcon,
  Cross1Icon,
  ChevronDownIcon,
  MobileIcon,
} from "@radix-ui/react-icons";
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
  Apple,
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";

import { LanguageLink } from "./language-link";
import { LanguageSwitcher } from "./language-switcher";
import { SiteLogo } from "./site-logo";

type ToolDefinition = {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  isNew?: boolean;
};

type CategoryDefinition = {
  category: string;
  description: string;
  tools: ToolDefinition[];
};

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface ProHeaderProps {
  urlLanguage: string;
}

export function ProHeader({ urlLanguage }: ProHeaderProps) {
  const { language, setLanguage, t } = useLanguageStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAppBanner, setShowAppBanner] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (urlLanguage && urlLanguage !== language) {
      useLanguageStore.setState({ language: urlLanguage as any });
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [urlLanguage, language]);

  const languages: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    {
      code: "id",
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      flag: "🇮🇩",
    },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "zh", name: "Chinese", nativeName: "中文 (Zhōngwén)", flag: "🇨🇳" },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية (al-ʿArabiyyah)",
      flag: "🇸🇦",
    },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी (Hindī)", flag: "🇮🇳" },
    {
      code: "ru",
      name: "Russian",
      nativeName: "Русский (Russkiy)",
      flag: "🇷🇺",
    },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語 (Nihongo)",
      flag: "🇯🇵",
    },
    { code: "ko", name: "Korean", nativeName: "한국어 (Hangugeo)", flag: "🇰🇷" },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  ];
  
  // Image tools categories
  const IMAGE_TOOLS: CategoryDefinition[] = [
    {
      category: isClient ? t("imageTools.categories.conversion") || "Format Conversion" : "Format Conversion",
      description: "Convert images between different formats",
      tools: [
        {
          name: isClient ? t("imageTools.makeTransparent.title") || "Make a PNG Transparent" : "Make a PNG Transparent",
          href: "/make-transparent",
          icon: <FileImage className="h-5 w-5 text-blue-500" />,
          description: isClient ? t("imageTools.makeTransparent.description") || "Quickly replace any color in a PNG file with transparency." : "Quickly replace any color in a PNG file with transparency."
        },
        {
          name: isClient ? t("imageTools.pngToJpg.title") || "Convert PNG to JPG" : "Convert PNG to JPG",
          href: "/png-to-jpg",
          icon: <Image className="h-5 w-5 text-blue-500" />,
          description: isClient ? t("imageTools.pngToJpg.description") || "Convert PNG graphics files to JPEG format with adjustable quality." : "Convert PNG graphics files to JPEG format with adjustable quality."
        },
        {
          name: isClient ? t("imageTools.jpgToPng.title") || "Convert JPG to PNG" : "Convert JPG to PNG",
          href: "/jpg-to-png",
          icon: <Image className="h-5 w-5 text-blue-500" />,
          description: isClient ? t("imageTools.jpgToPng.description") || "Convert JPEG images to PNG format with transparency support." : "Convert JPEG images to PNG format with transparency support."
        },
        {
          name: isClient ? t("imageTools.pngToWebp.title") || "Convert PNG to WebP" : "Convert PNG to WebP",
          href: "/png-to-webp",
          icon: <FileImage className="h-5 w-5 text-blue-500" />,
          description: isClient ? t("imageTools.pngToWebp.description") || "Convert PNG images to WebP for better web performance." : "Convert PNG images to WebP for better web performance."
        },
        {
          name: isClient ? t("imageTools.webpToPng.title") || "Convert WebP to PNG" : "Convert WebP to PNG",
          href: "/webp-to-png",
          icon: <FileImage className="h-5 w-5 text-blue-500" />,
          description: isClient ? t("imageTools.webpToPng.description") || "Convert WebP images to PNG format for better compatibility." : "Convert WebP images to PNG format for better compatibility."
        },
        {
          name: isClient ? t("imageTools.svgToPng.title") || "Convert SVG to PNG" : "Convert SVG to PNG",
          href: "/svg-to-png",
          icon: <FileImage className="h-5 w-5 text-blue-500" />,
          description: isClient ? t("imageTools.svgToPng.description") || "Convert vector SVG files to raster PNG images." : "Convert vector SVG files to raster PNG images."
        },
      ]
    },
    {
      category: isClient ? t("imageTools.categories.editing") || "Image Editing" : "Image Editing",
      description: "Edit and modify your images",
      tools: [
        {
          name: isClient ? t("imageTools.changeColors.title") || "Change Colors in PNG" : "Change Colors in PNG",
          href: "/change-colors",
          icon: <Palette className="h-5 w-5 text-purple-500" />,
          description: isClient ? t("imageTools.changeColors.description") || "Replace specific colors in your PNG images with new colors." : "Replace specific colors in your PNG images with new colors."
        },
        {
          name: isClient ? t("imageTools.changeTone.title") || "Change Color Tone" : "Change Color Tone",
          href: "/change-tone",
          icon: <Paintbrush className="h-5 w-5 text-purple-500" />,
          description: isClient ? t("imageTools.changeTone.description") || "Apply color tones and tints to your images for artistic effects." : "Apply color tones and tints to your images for artistic effects."
        },
        {
          name: "Resize Image",
          href: "/resize",
          icon: <Image className="h-5 w-5 text-purple-500" />,
          description: "Resize images to exact dimensions while preserving quality.",
          isNew: true
        },
        {
          name: "Crop Image",
          href: "/crop",
          icon: <Crop className="h-5 w-5 text-purple-500" />,
          description: "Crop images to remove unwanted areas and focus on important content.",
          isNew: true
        },
        {
          name: "Rotate & Flip",
          href: "/rotate",
          icon: <RotateCw className="h-5 w-5 text-purple-500" />,
          description: "Rotate and flip images to the correct orientation.",
          isNew: true
        },
        {
          name: "Add Text to Image",
          href: "/add-text",
          icon: <Type className="h-5 w-5 text-purple-500" />,
          description: "Add custom text, captions, or watermarks to your images.",
          isNew: true
        },
      ]
    },
    {
      category: isClient ? t("imageTools.categories.enhancement") || "Image Enhancement" : "Image Enhancement",
      description: "Enhance and improve your images",
      tools: [
        {
          name: isClient ? t("imageTools.noise.title") || "Add Noise" : "Add Noise",
          href: "/add-noise",
          icon: <Aperture className="h-5 w-5 text-green-500" />,
          description: isClient ? t("imageTools.noise.description") || "Add film grain or noise effects to your images." : "Add film grain or noise effects to your images."
        },
        {
          name: "Add Border",
          href: "/add-border",
          icon: <Square className="h-5 w-5 text-green-500" />,
          description: "Add custom borders to your images with various styles and colors.",
          isNew: true
        },
        {
          name: "Apply Image Filters",
          href: "/filters",
          icon: <SlidersHorizontal className="h-5 w-5 text-green-500" />,
          description: "Enhance images with professional filters like grayscale, sepia, and more.",
          isNew: true
        },
        {
          name: "Adjust Brightness & Contrast",
          href: "/adjust",
          icon: <Sun className="h-5 w-5 text-green-500" />,
          description: "Fine-tune brightness, contrast, saturation and other image properties.",
          isNew: true
        },
      ]
    },
    {
      category: isClient ? t("imageTools.categories.optimization") || "Optimization" : "Optimization",
      description: "Optimize your images for web performance",
      tools: [
        {
          name: isClient ? t("imageTools.compressPng.title") || "Compress PNG" : "Compress PNG",
          href: "/compress",
          icon: <Download className="h-5 w-5 text-amber-500" />,
          description: isClient ? t("imageTools.compressPng.description") || "Reduce PNG file sizes while maintaining quality." : "Reduce PNG file sizes while maintaining quality."
        },
        {
          name: "Compress JPG",
          href: "/compress-jpg",
          icon: <Download className="h-5 w-5 text-amber-500" />,
          description: "Optimize JPG images with adjustable quality settings.",
          isNew: true
        },
        {
          name: "Batch Resize",
          href: "/batch-resize",
          icon: <ImagePlus className="h-5 w-5 text-amber-500" />,
          description: "Resize multiple images at once to the same dimensions.",
          isNew: true
        },
      ]
    },
    {
      category: isClient ? t("imageTools.categories.advanced") || "Advanced Tools" : "Advanced Tools",
      description: "Advanced image processing tools",
      tools: [
        {
          name: isClient ? t("imageTools.pngToBase64.title") || "Convert PNG to Base64" : "Convert PNG to Base64",
          href: "/png-to-base64",
          icon: <FileImage className="h-5 w-5 text-indigo-500" />,
          description: isClient ? t("imageTools.pngToBase64.description") || "Convert PNG images to base64 encoding for embedding in web pages." : "Convert PNG images to base64 encoding for embedding in web pages."
        },
        {
          name: isClient ? t("imageTools.base64ToPng.title") || "Convert Base64 to PNG" : "Convert Base64 to PNG",
          href: "/base64-to-png",
          icon: <FileImage className="h-5 w-5 text-indigo-500" />,
          description: isClient ? t("imageTools.base64ToPng.description") || "Convert base64-encoded image strings back to PNG files." : "Convert base64-encoded image strings back to PNG files."
        },
        {
          name: "Remove Background",
          href: "/remove-background",
          icon: <CloudOff className="h-5 w-5 text-indigo-500" />,
          description: "Automatically remove backgrounds from photos and images.",
          isNew: true
        },
        {
          name: "Images to PDF",
          href: "/images-to-pdf",
          icon: <FileText className="h-5 w-5 text-indigo-500" />,
          description: "Convert multiple images to a single PDF document.",
          isNew: true
        },
        {
          name: "Merge Images",
          href: "/merge",
          icon: <Layers className="h-5 w-5 text-indigo-500" />,
          description: "Combine multiple images side by side or vertically.",
          isNew: true
        },
      ]
    },
  ];

  // Navigation items for image tools categories
  const navItems = [
    {
      label: isClient ? t("imageTools.title") || "Image Tools" : "Image Tools",
      href: "/image-tools",
    },
    {
      label: isClient ? t("imageTools.categories.conversion") || "Format Conversion" : "Format Conversion",
      dropdown: IMAGE_TOOLS.filter(cat => cat.category === (isClient ? t("imageTools.categories.conversion") || "Format Conversion" : "Format Conversion")),
    },
    {
      label: isClient ? t("imageTools.categories.editing") || "Image Editing" : "Image Editing",
      dropdown: IMAGE_TOOLS.filter(cat => cat.category === (isClient ? t("imageTools.categories.editing") || "Image Editing" : "Image Editing")),
    },
    {
      label: isClient ? t("imageTools.categories.enhancement") || "Image Enhancement" : "Image Enhancement",
      dropdown: IMAGE_TOOLS.filter(cat => cat.category === (isClient ? t("imageTools.categories.enhancement") || "Image Enhancement" : "Image Enhancement")),
    },
    {
      label: isClient ? t("imageTools.categories.optimization") || "Optimization" : "Optimization",
      dropdown: IMAGE_TOOLS.filter(cat => cat.category === (isClient ? t("imageTools.categories.optimization") || "Optimization" : "Optimization")),
    },
    {
      label: isClient ? t("imageTools.categories.advanced") || "Advanced Tools" : "Advanced Tools",
      dropdown: IMAGE_TOOLS.filter(cat => cat.category === (isClient ? t("imageTools.categories.advanced") || "Advanced Tools" : "Advanced Tools")),
    },
  ];

  const renderNewBadge = () => (
    <span className="ml-1.5 text-xs font-medium bg-primary/20 text-primary-foreground px-1.5 py-0.5 rounded-full">
      {t("ui.new")}
    </span>
  );

  return (
    <>
      {/* App Download Banner */}
      {showAppBanner && (
        <div className="bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground">
          <div className="container max-w-6xl mx-auto py-2 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <MobileIcon className="h-4 w-4 mr-2 hidden sm:inline-block" />
              <p className="text-sm font-medium">
                {isClient
                  ? t("nav.getApp") ||
                    "Get our mobile app for on-the-go image tools"
                  : "Get our mobile app for on-the-go image tools"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://apps.apple.com/us/app/ImagePro-pdf-scanner-app/id6743518395"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-black text-white px-2 py-1 rounded-md flex items-center"
              >
                <Apple className="h-3 w-3 mr-1" /> iOS
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.ImagePro.documentconverter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-primary-foreground text-primary px-2 py-1 rounded-md flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <polygon points="3 3 21 12 3 21 3 3"></polygon>
                </svg>
                Android
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-primary/20"
                onClick={() => setShowAppBanner(false)}
              >
                <Cross1Icon className="h-3 w-3" />
                <span className="sr-only">Close banner</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          scrolled ? "shadow-sm" : "border-b"
        } transition-all duration-200`}
      >
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between py-4 px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <LanguageLink href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl flex items-center">
                <SiteLogo />
                <span className="text-red-500"></span> ImagePro
              </span>
            </LanguageLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Navigation items with dropdowns */}
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.href ? (
                  <LanguageLink
                    href={item.href}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </LanguageLink>
                ) : (
                  <LanguageLink
                    href="#"
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary flex items-center gap-1"
                  >
                    {item.label}
                    <ChevronDownIcon className="h-4 w-4 opacity-70" />
                  </LanguageLink>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4">
                    {item.dropdown.map((category) => (
                      <div key={category.category} className="mb-4">
                        <div className="font-semibold text-sm text-foreground mb-2">
                          {category.category}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {category.tools.map((tool) => (
                            <LanguageLink
                              key={tool.name}
                              href={tool.href}
                              className="flex items-start gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                            >
                              <div className="p-1 rounded-md bg-primary/10">
                                {tool.icon}
                              </div>
                              <div>
                                <div className="text-sm font-medium flex items-center">
                                  {tool.name}
                                  {tool.isNew && renderNewBadge()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {tool.description}
                                </p>
                              </div>
                            </LanguageLink>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <Cross1Icon className="h-5 w-5" />
              ) : (
                <HamburgerMenuIcon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur border-t max-h-[calc(100vh-4rem)] overflow-y-auto shadow-md">
            <div className="container max-w-6xl mx-auto py-4 space-y-4">
              {/* Mobile Navigation Items */}
              {navItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  {item.href ? (
                    <LanguageLink
                      href={item.href}
                      className="block px-3 py-3 text-lg font-medium hover:bg-primary/5 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </LanguageLink>
                  ) : (
                    <div className="block px-3 py-3 text-lg font-medium hover:bg-primary/5 rounded-md transition-colors">
                      {item.label}
                    </div>
                  )}
                  
                  {item.dropdown && (
                    <div className="pl-4 space-y-4">
                      {item.dropdown.map((category) => (
                        <div key={category.category}>
                          <div className="grid grid-cols-2 gap-2">
                            {category.tools.map((tool) => (
                              <LanguageLink
                                key={tool.name}
                                href={tool.href}
                                className="flex items-start gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="p-1 rounded-md bg-primary/10">
                                  {tool.icon}
                                </div>
                                <div>
                                  <div className="text-sm font-medium flex items-center">
                                    {tool.name}
                                    {tool.isNew && renderNewBadge()}
                                  </div>
                                </div>
                              </LanguageLink>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}