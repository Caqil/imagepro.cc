"use client";
import React from "react";
import { useLanguageStore } from "@/src/store/store";
import { BackgroundRemover } from "@/components/background-remover";

export function RemoveBackgroundTool() {
  const { t } = useLanguageStore();

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">
          {t('imageTools.removeBackground.title') || "Remove Image Background"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('imageTools.removeBackground.description') || "Automatically remove backgrounds from your images"}
        </p>
      </div>
      
      <BackgroundRemover
        title={t('imageTools.removeBackground.toolTitle') || "Background Remover"}
        description={t('imageTools.removeBackground.toolDescription') || "Upload an image to remove its background instantly."}
        processEndpoint="image/remove-background"
        fileTypes={["image/jpeg", "image/png", "image/webp"]}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">
            {t('imageTools.removeBackground.howItWorksTitle') || "How It Works"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('imageTools.removeBackground.howItWorksDescription') || "Our tool uses AI technology to automatically detect and remove backgrounds from your images, leaving you with a clean subject on a transparent background."}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">
            {t('imageTools.removeBackground.useCasesTitle') || "Common Use Cases"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-base font-medium">
                {t('imageTools.removeBackground.useCase1Title') || "Product Photography"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.removeBackground.useCase1Description') || "Create clean product images for e-commerce."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">
                {t('imageTools.removeBackground.useCase2Title') || "Portrait Photos"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.removeBackground.useCase2Description') || "Remove backgrounds from portraits for professional use."}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">
                {t('imageTools.removeBackground.useCase3Title') || "Design Elements"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('imageTools.removeBackground.useCase3Description') || "Isolate objects for graphic design projects."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">
            {t('imageTools.removeBackground.tipsTitle') || "Tips for Best Results"}
          </h2>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>{t('imageTools.removeBackground.tip1') || "Use images with clear contrast between subject and background"}</li>
            <li>{t('imageTools.removeBackground.tip2') || "Upload high-resolution images for better quality"}</li>
            <li>{t('imageTools.removeBackground.tip3') || "Works best with distinct subjects"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}