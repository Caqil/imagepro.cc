// app/[lang]/page.tsx
import { Metadata } from "next";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { Homepage } from "./home-content";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "ImagePro - Professional Image Tools For Everyone",
    description: "Transform your images with our free online image tools. Edit, convert, enhance and optimize your images in seconds.",
    openGraph: {
      title: "ImagePro - Professional Image Tools For Everyone",
      description: "Transform your images with our free online image tools. Edit, convert, enhance and optimize your images in seconds.",
      url: `/${lang}`,
      siteName: "ImagePro",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "ImagePro Image Tools"
        }
      ],
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ImagePro - Professional Image Tools For Everyone",
      description: "Transform your images with our free online image tools. Edit, convert, enhance and optimize your images in seconds.",
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `/${lang}`,
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
          
          return [langCode, `/${code}`];
        })
      ),
    }
  };
}

export default function HomePage() {
  return <Homepage />;
}