"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguageStore } from "@/src/store/store";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { NoiseInfoSection } from "./noise-info-section";
import { addNoisePreview } from "@/lib/image-preview";

export function AddNoiseTool() {
  const { t } = useLanguageStore();
  const [noiseAmount, setNoiseAmount] = useState(30); // 0-100, default 30%
  const [noiseType, setNoiseType] = useState("gaussian"); // gaussian or salt-pepper
  const [monochrome, setMonochrome] = useState(false); // colored or monochrome noise

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="noise-amount">{t('imageTools.noise.amountLabel') || "Noise Amount"}: {noiseAmount}%</Label>
        </div>
        <Slider
          id="noise-amount"
          min={5}
          max={100}
          step={1}
          value={[noiseAmount]}
          onValueChange={(values) => setNoiseAmount(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          {t('imageTools.noise.amountHint') || "Higher values create more noticeable noise. For subtle effects, use values below 30%."}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="noise-type">{t('imageTools.noise.typeLabel') || "Noise Type"}</Label>
        <Select
          value={noiseType}
          onValueChange={(value) => setNoiseType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('imageTools.noise.selectType') || "Select noise type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaussian">{t('imageTools.noise.gaussian') || "Gaussian (Smooth)"}</SelectItem>
            <SelectItem value="salt-pepper">{t('imageTools.noise.saltPepper') || "Salt & Pepper (Speckles)"}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('imageTools.noise.typeHint') || "Gaussian noise adds subtle grain, while Salt & Pepper adds random white and black pixels."}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="monochrome" 
          checked={monochrome}
          onCheckedChange={setMonochrome}
        />
        <Label htmlFor="monochrome">{t('imageTools.noise.monochrome') || "Monochrome Noise"}</Label>
      </div>
      <p className="text-xs text-muted-foreground">
       {t('imageTools.noise.monochromeHint') || "When enabled, noise will be black and white only. When disabled, colored noise will be used."}
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">{t('imageTools.noise.title') || "Add Noise to PNG"}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('imageTools.noise.description') || "Add film grain or noise effects to your PNG images for artistic styling"}
        </p>
      </div>
      
      <ImageProcessor
        title={t('imageTools.noise.toolTitle') || "PNG Noise Generator"}
        description={t('imageTools.noise.toolDescription') || "Upload a PNG image to add noise or grain effects."}
        processEndpoint="image/add-noise"
        fileTypes={["image/png"]}
        processOptions={{ 
          noiseAmount,
          noiseType,
          monochrome
        }}
        renderOptions={renderOptions}
        previewRenderer={addNoisePreview}
      />
      
      <NoiseInfoSection />
    </div>
  );
}