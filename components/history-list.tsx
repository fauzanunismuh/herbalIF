"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, History, ImageIcon } from "lucide-react"
import { getHistory, deleteFromHistory, type IdentificationResult } from "@/lib/history"
import { getCurrentUser } from "@/lib/auth"

interface HistoryListProps {
  refreshTrigger: number
}

export function HistoryList({ refreshTrigger }: HistoryListProps) {
  const [history, setHistory] = useState<IdentificationResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHistory = () => {
    const user = getCurrentUser()
    if (user) {
      const userHistory = getHistory(user.id)
      setHistory(userHistory)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadHistory()
  }, [refreshTrigger])

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini dari riwayat?")) {
      deleteFromHistory(id)
      loadHistory()
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Memuat riwayat...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Riwayat Identifikasi
        </CardTitle>
        <CardDescription>Daftar tanaman yang telah Anda identifikasi sebelumnya</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada riwayat identifikasi</p>
            <p className="text-sm">Upload gambar daun untuk memulai identifikasi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {item.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.imageName}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold capitalize">{item.prediction}</h3>
                          <Badge
                            variant={item.category === "Herbal" ? "default" : "secondary"}
                            className={item.category === "Herbal" ? "bg-primary" : ""}
                          >
                            {item.category}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{item.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>File: {item.imageName}</span>
                          <span>
                            {new Date(item.timestamp).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
