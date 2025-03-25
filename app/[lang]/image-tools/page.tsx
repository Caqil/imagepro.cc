// app/[lang]/image-tools/page.tsx
import { Metadata } from "next";
import { ImageTools } from "@/components/image-tools";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Image Tools - Edit, Convert, Optimize & Enhance Images Online",
    description: "Free online image tools to convert, compress, edit and transform your images. No registration required.",
    openGraph: {
      title: "Image Tools - Edit, Convert, Optimize & Enhance Images Online",
      description: "Free online image tools to convert, compress, edit and transform your images. No registration required.",
      url: `/${lang}/image-tools`,
      siteName: "ScanPro",
      images: [
        {
          url: "/og-image-tools.png",
          width: 1200,
          height: 630,
          alt: "ScanPro Image Tools"
        }
      ],
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Image Tools - Edit, Convert, Optimize & Enhance Images Online",
      description: "Free online image tools to convert, compress, edit and transform your images. No registration required.",
      images: ["/og-image-tools.png"],
    },
    alternates: {
      canonical: `/${lang}/image-tools`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(code => {
          const langCode = {
            'en': 'en-US',
            'id': 'id-ID',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'hi': 'hi-IN',
            'ru': 'ru-RU',
            'pt': 'pt-BR',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'it': 'it-IT',
            'tr': 'tr-TR'
          }[code] || `${code}`;
          
          return [langCode, `/${code}/image-tools`];
        })
      ),
    }
  };
}

// Use a different name for the page component to avoid recursion
export default function Page() {
  return <ImageTools />;
}