// app/[lang]/merge/page.tsx
import { Metadata } from "next";
import { MergeImagesTool } from "./merge-images-tool";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  // Create a translation function similar to t()
  const t = (key: string) => getTranslation(lang, key);
  
  const title = t('imageTools.mergeImages.metaTitle') || "Merge Images | Image Tools";
  const description = t('imageTools.mergeImages.metaDescription') || "Combine multiple images side by side or vertically into a single image";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${lang}/image-tools/merge`,
      siteName: t('metadata.title') || "ImagePro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/merge`,
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
          
          return [langCode, `/${code}/image-tools/merge`];
        })
      ),
    }
  };
}

export default function MergeImagesPage() {
  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <MergeImagesTool />
    </div>
  );
}
            