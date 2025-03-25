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
  FileText,
  Image,
  Table,
  ArrowRight,
  ArrowDown,
  Shield,
  Lock,
  Download,
  Apple,
  FileBoxIcon,
  FileCheck2,
  PenTool,
  FileImage,
  Palette,
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
  const PDF_TOOLS: CategoryDefinition[] = [
    {
      category: isClient
        ? t("pdfTools.categories.convertFromPdf")
        : "Convert PDF",
      description:
        t("pdfTools.categories.convertFromPdfDesc") ||
        "Convert PDF files to various formats and vice versa",
      tools: [
        {
          name: t("popular.pdfToWord"),
          href: "/convert/pdf-to-docx",
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          description: t("popular.pdfToWordDesc"),
        },
        {
          name: t("popular.pdfToExcel"),
          href: "/convert/pdf-to-xlsx",
          icon: <Table className="h-5 w-5 text-green-500" />,
          description: t("popular.pdfToExcelDesc"),
        },
        {
          name: t("popular.pdfToJpg"),
          href: "/convert/pdf-to-jpg",
          icon: <Image className="h-5 w-5 text-yellow-500" />,
          description: t("popular.pdfToJpgDesc"),
        },
        {
          name: t("popular.wordToPdf"),
          href: "/convert/docx-to-pdf",
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          description: t("popular.wordToPdfDesc"),
        },
        {
          name: t("popular.jpgToPdf"),
          href: "/convert/jpg-to-pdf",
          icon: <Image className="h-5 w-5 text-yellow-500" />,
          description: t("popular.jpgToPdfDesc"),
        },
      ],
    },
    {
      category: t("pdfTools.categories.organizePdf") || "PDF Management",
      description:
        t("pdfTools.categories.organizePdfDesc") ||
        "Tools to organize and modify PDF files",
      tools: [
        {
          name: t("popular.mergePdf"),
          href: "/merge",
          icon: <ArrowRight className="h-5 w-5 text-red-500" />,
          description: t("popular.mergePdfDesc"),
        },
        {
          name: t("popular.splitPdf"),
          href: "/split",
          icon: <ArrowDown className="h-5 w-5 text-green-500" />,
          description: t("popular.splitPdfDesc"),
        },
        {
          name: t("popular.compressPdf"),
          href: "/compress",
          icon: <Download className="h-5 w-5 text-purple-500" />,
          description: t("popular.compressPdfDesc"),
        },
        {
          name: t("universalCompressor.title"),
          href: "/compress-files",
          icon: <FileBoxIcon className="h-5 w-5 text-purple-500" />,
          description: t("universalCompressor.description"),
        },
      ],
    },
    {
      category: t("pdfTools.categories.pdfSecurity") || "PDF Security",
      description: "Protect and manage PDF access",
      tools: [
        {
          name: t("popular.unlockPdf"),
          href: "/unlock",
          icon: <Lock className="h-5 w-5 text-blue-500" />,
          description: t("popular.unlockPdfDesc"),
        },
        {
          name: t("popular.protectPdf"),
          href: "/protect",
          icon: <Shield className="h-5 w-5 text-blue-500" />,
          description: t("popular.protectPdfDesc"),
        },
        {
          name: t("popular.signPdf"),
          href: "/sign",
          icon: <PenTool className="h-5 w-5 text-green-500" />,
          description: t("popular.signPdfDesc"),
        },
        {
          name: t("popular.ocr"),
          href: "/ocr",
          icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
          description: t("popular.ocrDesc"),
        },
      ],
    },
  ];

  // Image tools for direct navigation
  const IMAGE_TOOLS = [
    {
      name: "Make Transparent",
      href: "/image-tools/make-transparent",
      icon: <FileImage className="h-5 w-5 text-blue-500" />,
      description: "Remove backgrounds by replacing colors with transparency",
    },
    {
      name: "Change Colors",
      href: "/image-tools/change-colors",
      icon: <Palette className="h-5 w-5 text-purple-500" />,
      description: "Replace specific colors in your images",
    },
    {
      name: "Change Color Tone",
      href: "/image-tools/change-tone",
      icon: <Palette className="h-5 w-5 text-amber-500" />,
      description: "Apply color tones and tints to your images",
    },
    {
      name: "Compress PNG",
      href: "/image-tools/compress",
      icon: <Image className="h-5 w-5 text-green-500" />,
      description: "Reduce PNG file sizes while maintaining quality",
    },
    {
      name: "PNG to JPG",
      href: "/image-tools/png-to-jpg",
      icon: <FileImage className="h-5 w-5 text-blue-500" />,
      description: "Convert PNG images to JPG format",
    },
    {
      name: "JPG to PNG",
      href: "/image-tools/jpg-to-png",
      icon: <FileImage className="h-5 w-5 text-blue-500" />,
      description: "Convert JPG images to PNG format",
    },
  ];

  const navItems = [
    {
      label: isClient ? t("imageTools.title") || "Image Tools" : "Image Tools",
      href: "/image-tools",
    },
    {
      label: t("nav.convertPdf"),
      dropdown: PDF_TOOLS.filter(
        (cat) =>
          cat.category ===
          (isClient ? t("pdfTools.categories.convertFromPdf") : "Convert PDF")
      ),
    },
    {
      label: t("pdfTools.categories.organizePdf"),
      dropdown: PDF_TOOLS.filter(
        (cat) =>
          cat.category ===
          (isClient ? t("pdfTools.categories.organizePdf") : "PDF Management")
      ),
    },
    {
      label: t("pdfTools.categories.pdfSecurity"),
      dropdown: PDF_TOOLS.filter(
        (cat) =>
          cat.category ===
          (isClient ? t("pdfTools.categories.pdfSecurity") : "PDF Security")
      ),
    },
    {
      label: t("popular.viewAll"),
      dropdown: PDF_TOOLS,
    },
  ];

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
                    "Get our mobile app for on-the-go PDF tools"
                  : "Get our mobile app for on-the-go PDF tools"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://apps.apple.com/us/app/scanpro-pdf-scanner-app/id6743518395"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium bg-black text-white px-2 py-1 rounded-md flex items-center"
              >
                <Apple className="h-3 w-3 mr-1" /> iOS
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.scanpro.documentconverter"
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
                <span className="text-red-500"></span> ScanPro
              </span>
            </LanguageLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Direct link to Image Tools */}
            <LanguageLink
              href="/image-tools"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {isClient
                ? t("imageTools.title") || "Image Tools"
                : "Image Tools"}
            </LanguageLink>

            {/* PDF Tool Dropdowns */}
            {navItems.slice(1).map((item) => (
              <div key={item.label} className="relative group">
                {item.dropdown && (
                  <>
                    <LanguageLink
                      href="#"
                      className="text-sm font-medium text-foreground transition-colors hover:text-primary flex items-center gap-1"
                    >
                      {item.label}
                      <ChevronDownIcon className="h-4 w-4 opacity-70" />
                    </LanguageLink>

                    {/* Dropdown Menu */}
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
                                  <div className="text-sm font-medium">
                                    {tool.name}
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
                  </>
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
              {/* Direct link to Image Tools */}
              <LanguageLink
                href="/image-tools"
                className="block px-3 py-3 text-lg font-medium hover:bg-primary/5 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isClient
                  ? t("imageTools.title") || "Image Tools"
                  : "Image Tools"}
              </LanguageLink>

              {/* Image Tools Sub-Items */}
              <div className="pl-4 space-y-2">
                <div className="text-sm font-medium text-primary mb-2">
                  Popular Image Tools
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_TOOLS.map((tool) => (
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
                        <div className="text-sm font-medium">{tool.name}</div>
                      </div>
                    </LanguageLink>
                  ))}
                </div>
              </div>

              {/* PDF Tools Sections */}
              {navItems.slice(1).map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="block px-3 py-3 text-lg font-medium hover:bg-primary/5 rounded-md transition-colors">
                    {item.label}
                  </div>
                  {item.dropdown && (
                    <div className="pl-4 space-y-2">
                      {item.dropdown.map((category) => (
                        <div key={category.category}>
                          <div className="text-sm font-medium text-primary mb-2">
                            {category.category}
                          </div>
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
                                  <div className="text-sm font-medium">
                                    {tool.name}
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
