// app/[lang]/remove-background/page.tsx
import { Metadata } from "next";
import { RemoveBackgroundTool } from "./remove-background-tool";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  // Create a translation function similar to t()
  const t = (key: string) => getTranslation(lang, key);
  
  const title = t('imageTools.removeBackground.metaTitle') || "Remove Image Background | Image Tools";
  const description = t('imageTools.removeBackground.metaDescription') || "Automatically remove backgrounds from your images with advanced detection";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/image-tools/remove-background`,
      siteName: t('metadata.title') || "ImagePro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/remove-background`,
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
          
          return [langCode, `/${code}/image-tools/remove-background`];
        })
      ),
    }
  };
}

export default function RemoveBackgroundPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <RemoveBackgroundTool />
    </div>
  );
}