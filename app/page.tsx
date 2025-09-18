"use client";

import { AuthForm } from "@/components/auth-form";
import { HistoryList } from "@/components/history-list";
import { PlantIdentification } from "@/components/plant-identification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import { History, Leaf, LogOut, Upload, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleResultSaved = () => {
    setHistoryRefresh((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-8 w-8 animate-pulse mx-auto mb-4 text-primary" />
          <p>Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HerbalIF</h1>
                <p className="text-sm text-muted-foreground">
                  Universitas Muhammadiyah Makassar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            Sistem Identifikasi Tanaman Herbal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aplikasi berbasis KNN dan PSO untuk mengidentifikasi tanaman herbal
            dan non-herbal melalui analisis citra daun menggunakan fitur Average
            RGB.
          </p>
        </div>

        <Tabs defaultValue="identify" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="identify" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Identifikasi
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identify" className="space-y-6">
            <PlantIdentification
              apiUrl={API_URL}
              onResultSaved={handleResultSaved}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryList refreshTrigger={historyRefresh} />
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tentang Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                HerbalIF menggunakan algoritma K-Nearest Neighbors (KNN) yang
                dioptimasi dengan Particle Swarm Optimization (PSO) untuk
                mengklasifikasikan tanaman berdasarkan fitur rata-rata warna RGB
                dari citra daun.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cara Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                <li>1. Upload gambar daun tanaman yang jelas</li>
                <li>2. Klik tombol "Identifikasi Tanaman"</li>
                <li>3. Lihat hasil klasifikasi dan informasi tanaman</li>
                <li>4. Cek riwayat identifikasi di tab "Riwayat"</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background/80 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 HerbalIF - Universitas Muhammadiyah Makassar</p>
          <p>
            Dikembangkan oleh: Fauzan Azhari Rahman, Muh. Tegar Al Fikri,
            Muhammad Dzulfikar Hidayat
          </p>
        </div>
      </footer>
    </div>
  );
}
