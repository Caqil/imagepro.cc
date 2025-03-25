"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/src/store/store";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BorderInfoSection } from "./border-info-section";
import { addBorderPreview } from "@/lib/image-preview";

export function AddBorderTool() {
  const { t } = useLanguageStore();
  
  // Basic border settings
  const [borderStyle, setBorderStyle] = useState("solid");
  const [borderWidth, setBorderWidth] = useState(20);
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderRadius, setBorderRadius] = useState(0);
  
  // Advanced border settings
  const [useGradient, setUseGradient] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(45);
  const [gradientColor1, setGradientColor1] = useState("#ff0000");
  const [gradientColor2, setGradientColor2] = useState("#0000ff");
  
  // Frame settings
  const [frameWidth, setFrameWidth] = useState(10);
  const [frameColor, setFrameColor] = useState("#ffffff");
  const [useFrame, setUseFrame] = useState(false);
  
  // Image padding
  const [padding, setPadding] = useState(20);
  
  // Shadow settings
  const [useShadow, setUseShadow] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowOffsetX, setShadowOffsetX] = useState(5);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);
  
  // Apply preset border styles
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "simple":
        setBorderStyle("solid");
        setBorderWidth(20);
        setBorderColor("#000000");
        setBorderRadius(0);
        setUseGradient(false);
        setUseFrame(false);
        setUseShadow(false);
        setPadding(20);
        break;
      case "rounded":
        setBorderStyle("solid");
        setBorderWidth(20);
        setBorderColor("#000000");
        setBorderRadius(30);
        setUseGradient(false);
        setUseFrame(false);
        setUseShadow(false);
        setPadding(20);
        break;
      case "polaroid":
        setBorderStyle("solid");
        setBorderWidth(40);
        setBorderColor("#ffffff");
        setBorderRadius(4);
        setUseGradient(false);
        setUseFrame(false);
        setUseShadow(true);
        setShadowColor("#000000");
        setShadowBlur(10);
        setShadowOffsetX(5);
        setShadowOffsetY(5);
        setPadding(5);
        break;
      case "gradient":
        setBorderStyle("solid");
        setBorderWidth(20);
        setBorderRadius(0);
        setUseGradient(true);
        setGradientType("linear");
        setGradientAngle(45);
        setGradientColor1("#ff0000");
        setGradientColor2("#0000ff");
        setUseFrame(false);
        setUseShadow(false);
        setPadding(20);
        break;
      case "frame":
        setBorderStyle("solid");
        setBorderWidth(40);
        setBorderColor("#8B4513"); // Brown
        setBorderRadius(0);
        setUseGradient(false);
        setUseFrame(true);
        setFrameWidth(5);
        setFrameColor("#D2B48C"); // Tan
        setUseShadow(true);
        setShadowColor("#000000");
        setShadowBlur(15);
        setShadowOffsetX(8);
        setShadowOffsetY(8);
        setPadding(40);
        break;
      case "vintage":
        setBorderStyle("solid");
        setBorderWidth(30);
        setBorderColor("#F5F5DC"); // Beige
        setBorderRadius(5);
        setUseGradient(true);
        setGradientType("linear");
        setGradientAngle(45);
        setGradientColor1("#D2B48C"); // Tan
        setGradientColor2("#8B4513"); // Brown
        setUseFrame(true);
        setFrameWidth(3);
        setFrameColor("#8B4513"); // Brown
        setUseShadow(true);
        setShadowColor("#000000");
        setShadowBlur(10);
        setShadowOffsetX(5);
        setShadowOffsetY(5);
        setPadding(20);
        break;
    }
  };

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preset">{t("imageTools.addBorder.stylesTitle")}</Label>
        <Select onValueChange={applyPreset}>
          <SelectTrigger id="preset">
            <SelectValue placeholder={t("ui.select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">{t("imageTools.addBorder.basicTitle")}</SelectItem>
            <SelectItem value="rounded">{t("ui.rounded")}</SelectItem>
            <SelectItem value="polaroid">{t("ui.polaroid")}</SelectItem>
            <SelectItem value="gradient">{t("imageTools.addBorder.gradientTitle")}</SelectItem>
            <SelectItem value="frame">{t("imageTools.addBorder.frameTitle")}</SelectItem>
            <SelectItem value="vintage">{t("ui.vintage")}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t("imageTools.addBorder.tip7")}
        </p>
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">{t("ui.basic")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("ui.advanced")}</TabsTrigger>
          <TabsTrigger value="effects">{t("ui.effects")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="border-width">{t("ui.borderWidth")}: {borderWidth}px</Label>
            </div>
            <Slider
              id="border-width"
              min={0}
              max={100}
              step={1}
              value={[borderWidth]}
              onValueChange={(values) => setBorderWidth(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="border-color">{t("ui.borderColor")}</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="border-color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-10 h-10"
              />
              <Input
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="border-radius">{t("ui.cornerRadius")}: {borderRadius}px</Label>
            </div>
            <Slider
              id="border-radius"
              min={0}
              max={100}
              step={1}
              value={[borderRadius]}
              onValueChange={(values) => setBorderRadius(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="border-style">{t("ui.borderStyle")}</Label>
            <Select value={borderStyle} onValueChange={setBorderStyle}>
              <SelectTrigger id="border-style">
                <SelectValue placeholder={t("ui.select")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t("ui.solid")}</SelectItem>
                <SelectItem value="dashed">{t("ui.dashed")}</SelectItem>
                <SelectItem value="dotted">{t("ui.dotted")}</SelectItem>
                <SelectItem value="double">{t("ui.double")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="padding">{t("ui.padding")}: {padding}px</Label>
            </div>
            <Slider
              id="padding"
              min={0}
              max={100}
              step={1}
              value={[padding]}
              onValueChange={(values) => setPadding(values[0])}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-gradient" 
              checked={useGradient}
              onCheckedChange={setUseGradient}
            />
            <Label htmlFor="use-gradient">{t("imageTools.addBorder.gradientTitle")}</Label>
          </div>
          
          {useGradient && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="gradient-type">{t("ui.gradientType")}</Label>
                <Select value={gradientType} onValueChange={setGradientType}>
                  <SelectTrigger id="gradient-type">
                    <SelectValue placeholder={t("ui.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">{t("imageTools.addBorder.linearGradient")}</SelectItem>
                    <SelectItem value="radial">{t("imageTools.addBorder.radialGradient")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {gradientType === "linear" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="gradient-angle">{t("ui.angle")}: {gradientAngle}°</Label>
                  </div>
                  <Slider
                    id="gradient-angle"
                    min={0}
                    max={360}
                    step={1}
                    value={[gradientAngle]}
                    onValueChange={(values) => setGradientAngle(values[0])}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="gradient-color-1">{t("ui.color")} 1</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="gradient-color-1"
                    value={gradientColor1}
                    onChange={(e) => setGradientColor1(e.target.value)}
                    className="w-10 h-10"
                  />
                  <Input
                    value={gradientColor1}
                    onChange={(e) => setGradientColor1(e.target.value)}
                    placeholder="#ff0000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gradient-color-2">{t("ui.color")} 2</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="gradient-color-2"
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    className="w-10 h-10"
                  />
                  <Input
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    placeholder="#0000ff"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="use-frame" 
              checked={useFrame}
              onCheckedChange={setUseFrame}
            />
            <Label htmlFor="use-frame">{t("imageTools.addBorder.frameDesc")}</Label>
          </div>
          
          {useFrame && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="frame-width">{t("ui.frameWidth")}: {frameWidth}px</Label>
                </div>
                <Slider
                  id="frame-width"
                  min={1}
                  max={50}
                  step={1}
                  value={[frameWidth]}
                  onValueChange={(values) => setFrameWidth(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frame-color">{t("ui.frameColor")}</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="frame-color"
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-10 h-10"
                  />
                  <Input
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-shadow" 
              checked={useShadow}
              onCheckedChange={setUseShadow}
            />
            <Label htmlFor="use-shadow">{t("imageTools.addBorder.shadowTitle")}</Label>
          </div>
          
          {useShadow && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="shadow-color">{t("ui.shadowColor")}</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id="shadow-color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-10 h-10"
                  />
                  <Input
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="shadow-blur">{t("ui.blur")}: {shadowBlur}px</Label>
                </div>
                <Slider
                  id="shadow-blur"
                  min={0}
                  max={50}
                  step={1}
                  value={[shadowBlur]}
                  onValueChange={(values) => setShadowBlur(values[0])}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shadow-offset-x">{t("ui.horizontalOffset")}: {shadowOffsetX}px</Label>
                  <Slider
                    id="shadow-offset-x"
                    min={-50}
                    max={50}
                    step={1}
                    value={[shadowOffsetX]}
                    onValueChange={(values) => setShadowOffsetX(values[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shadow-offset-y">{t("ui.verticalOffset")}: {shadowOffsetY}px</Label>
                  <Slider
                    id="shadow-offset-y"
                    min={-50}
                    max={50}
                    step={1}
                    value={[shadowOffsetY]}
                    onValueChange={(values) => setShadowOffsetY(values[0])}
                  />
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div>
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <h1 className="text-3xl font-bold">{t("imageTools.addBorder.title")}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("imageTools.addBorder.description")}
      </p>
    </div>
    
    <ImageProcessor
      title={t("imageTools.addBorder.metaTitle")}
      description={t("imageTools.addBorder.metaDescription")}
      processEndpoint="image/add-border"
      fileTypes={["image/jpeg", "image/png", "image/webp"]}
      processOptions={{
        borderStyle,
        borderWidth,
        borderColor,
        borderRadius,
        useGradient,
        gradientType,
        gradientAngle,
        gradientColor1,
        gradientColor2,
        useFrame,
        frameWidth,
        frameColor,
        padding,
        useShadow,
        shadowColor,
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY
      }}
      renderOptions={renderOptions}
      previewRenderer={addBorderPreview}
    />
    
    <BorderInfoSection />
  </div>
  );
}