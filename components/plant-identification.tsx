"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { saveToHistory, PLANT_INFO } from "@/lib/history"
import { getCurrentUser } from "@/lib/auth"

interface PredictionResult {
  prediksi: string
  error?: string
}

interface PlantIdentificationProps {
  onResultSaved: () => void
}

export function PlantIdentification({ onResultSaved }: PlantIdentificationProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Call Flask backend API
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })

      const data: PredictionResult = await response.json()

      if (data.error) {
        setResult({ prediksi: "", error: data.error })
      } else {
        setResult(data)

        // Save to history
        const user = getCurrentUser()
        if (user && data.prediksi) {
          const plantInfo = PLANT_INFO[data.prediksi] || {
            category: "Non-Herbal" as const,
            description: "Informasi tanaman tidak tersedia.",
          }

          saveToHistory({
            userId: user.id,
            imageName: selectedFile.name,
            imageUrl: previewUrl || "",
            prediction: data.prediksi,
            category: plantInfo.category,
            description: plantInfo.description,
          })

          onResultSaved()
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setResult({
        prediksi: "",
        error: "Gagal terhubung ke server. Pastikan Flask backend berjalan di port 5000.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Identifikasi Tanaman
        </CardTitle>
        <CardDescription>
          Upload gambar daun tanaman untuk mengidentifikasi apakah termasuk tanaman herbal atau non-herbal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Pilih Gambar Daun</Label>
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
        </div>

        {previewUrl && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full h-64 object-contain mx-auto rounded"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Identifikasi Tanaman
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        )}

        {result && (
          <Card className={result.error ? "border-destructive" : "border-primary"}>
            <CardHeader>
              <CardTitle className={result.error ? "text-destructive" : "text-primary"}>
                {result.error ? "Error" : "Hasil Identifikasi"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.error ? (
                <p className="text-destructive">{result.error}</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Nama Tanaman:</Label>
                    <p className="text-lg font-semibold capitalize">{result.prediksi}</p>
                  </div>

                  {PLANT_INFO[result.prediksi] && (
                    <>
                      <div>
                        <Label className="text-sm font-medium">Kategori:</Label>
                        <p
                          className={`inline-block px-2 py-1 rounded text-sm font-medium ml-2 ${
                            PLANT_INFO[result.prediksi].category === "Herbal"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {PLANT_INFO[result.prediksi].category}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Deskripsi:</Label>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {PLANT_INFO[result.prediksi].description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
