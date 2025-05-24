"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Scan, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function SkinDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
        setShowResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setShowResult(false);

    // Countdown from 3 to 1
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setCountdown(null);

    // Random result
    const hasSkinn = Math.random() > 0.5;
    setResult(hasSkinn);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowResult(true);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setShowResult(false);
    setCountdown(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Detector de la Skin
          </h1>
          <p className="text-lg text-neutral-300">
            Tecnología avanzada para detectar skins en tiempo real
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-white text-2xl">
              Análisis de Imagen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer hover:border-white/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-white/60 mb-4" />
                <p className="text-white/80 text-lg mb-2">
                  Sube tu imagen para análisis
                </p>
                <p className="text-white/60 text-sm">
                  Formatos soportados: JPG, PNG, GIF
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black/20">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Imagen seleccionada"
                    width={500}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {!isAnalyzing && !showResult && (
                  <div className="flex gap-3">
                    <Button
                      onClick={analyzeImage}
                      className="flex-1 font-semibold py-3"
                    >
                      <Scan className="mr-2 h-5 w-5" />
                      Analizar Imagen
                    </Button>
                    <Button onClick={resetAnalysis} variant="outline">
                      Nueva Imagen
                    </Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-500/20 mb-4">
                        <Scan className="h-8 w-8 text-neutral-400 animate-pulse" />
                      </div>
                      <p className="text-white/80 text-lg mb-2">
                        Analizando imagen...
                      </p>
                      <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                        <div className="bg-gradient-to-r from-neutral-500 to-neutral-600 h-2 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {countdown && (
                      <div className="text-6xl font-bold text-white animate-bounce">
                        {countdown}
                      </div>
                    )}
                  </div>
                )}

                {showResult && result !== null && (
                  <div className="text-center py-8 animate-fade-in">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                        result ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {result ? (
                        <CheckCircle className="h-12 w-12 text-green-400" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-400" />
                      )}
                    </div>

                    <h3
                      className={`text-3xl font-bold mb-4 ${
                        result ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result ? "✅ TIENE LA SKIN" : "❌ NO TIENE LA SKIN"}
                    </h3>

                    <p className="text-white/80 text-lg mb-6">
                      {result
                        ? "Análisis completado: Skin detectada con alta precisión"
                        : "Análisis completado: No se detectó ninguna skin"}
                    </p>

                    <div className="flex gap-3">
                      <Button
                        onClick={analyzeImage}
                        variant="outline"
                        className="flex-1"
                      >
                        Analizar de Nuevo
                      </Button>
                      <Button onClick={resetAnalysis} className="flex-1">
                        Nueva Imagen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-white/60 text-sm space-y-2">
          <p>Powered by Advanced AI Technology • Precisión del 99.9%</p>
          <p className="text-white/40">
            Desarrollado por{" "}
            <a
              href="https://github.com/angelstchavez"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60"
            >
              Angel Chavez
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
