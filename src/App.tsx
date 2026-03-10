import React, { useState, useEffect } from "react";
import { X, Zap, Settings } from "lucide-react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ViewModeNav } from "./components/ViewModeNav";
import { ViewPage } from "./pages/ViewPage";
import { ResultGallery } from "./components/ResultGallery";
import { fal } from "@fal-ai/client";
import { generateBridalImage, AIModelId, ViewMode } from "./services/falApi";

interface GenerationResult {
  id: string;
  url: string;
  timestamp: string;
  engine: string;
  seed: number;
  viewMode: string;
}

const App: React.FC = () => {
  const [dressUrl, setDressUrl] = useState<string>("");
  const [modelUrl, setModelUrl] = useState<string>("");
  const [locationUrl, setLocationUrl] = useState<string>("");
  const [engine, setEngine] = useState<AIModelId>("fal-ai/nano-banana-pro/edit");
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const quality = "quality" as const;
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [falKey, setFalKey] = useState<string>(localStorage.getItem("FAL_KEY") || import.meta.env.VITE_FAL_KEY || "");
  const [showSettings, setShowSettings] = useState<boolean>(!localStorage.getItem("FAL_KEY") && !import.meta.env.VITE_FAL_KEY);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [shootMode, setShootMode] = useState<"studio" | "location">("studio");

  const location = useLocation();

  const getCurrentViewMode = (): ViewMode => {
    if (location.pathname === "/back") return "back";
    if (location.pathname === "/closeup") return "closeup";
    if (location.pathname === "/location") return "location";
    if (location.pathname === "/location-closeup") return "location-closeup";
    return "front";
  };

  useEffect(() => {
    if (falKey) {
      localStorage.setItem("FAL_KEY", falKey);
      fal.config({ credentials: falKey });
    }
  }, [falKey]);

  useEffect(() => {
    if (location.pathname === "/location" || location.pathname === "/location-closeup") {
      setShootMode("location");
    } else if (shootMode === "location" && location.pathname !== "/location" && location.pathname !== "/location-closeup") {
      setShootMode("studio");
    }
  }, [location.pathname]);

  useEffect(() => {
    const viewMode = getCurrentViewMode();
    if (viewMode !== "front" && engine !== "fal-ai/nano-banana-pro/edit") {
      setEngine("fal-ai/nano-banana-pro/edit");
    }
  }, [location.pathname]);

  const handleGenerate = async () => {
    const viewMode = getCurrentViewMode();
    if (!dressUrl || !modelUrl) {
      alert("Lütfen hem tasarım hem de model görselini yükleyin.");
      return;
    }
    if ((viewMode === "location" || viewMode === "location-closeup") && !locationUrl) {
      alert("Lütfen mekan fotoğrafını yükleyin.");
      return;
    }
    if (!falKey) {
      alert("Lütfen Fal.ai API anahtarınızı girin.");
      setShowSettings(true);
      return;
    }

    try {
      setIsLoading(true);
      setProgressMsg("Veriler Senkronize Ediliyor...");
      const currentSeed = seed || Math.floor(Math.random() * 1000000);
      const response = await generateBridalImage({
        modelId: engine,
        garmentImageUrl: dressUrl,
        modelImageUrl: modelUrl,
        seed: currentSeed,
        quality: quality,
        viewMode: viewMode,
        locationImageUrl: (viewMode === "location" || viewMode === "location-closeup") ? locationUrl : undefined,
      }, (update) => {
        if (update.status === "IN_PROGRESS") {
          const lastLog = update.logs?.[update.logs.length - 1]?.message || "İşleniyor...";
          setProgressMsg(lastLog);
        }
      });

      const newImageUrl = engine === "fal-ai/fashn/tryon/v1.5"
        ? response.data.images[0].url
        : engine === "fal-ai/idm-vton"
          ? response.data.image.url
          : response.data.images[0].url;

      const viewLabels: Record<string, string> = { front: "Ön", back: "Arka", closeup: "Yakın", location: "Mekan", "location-closeup": "Dış Yakın" };

      const newResult: GenerationResult = {
        id: Math.random().toString(36).substring(7),
        url: newImageUrl,
        timestamp: new Date().toLocaleTimeString(),
        engine: `${viewLabels[viewMode] || "Ön"} · ${engine.split("/").pop() || engine}`,
        seed: currentSeed,
        viewMode: viewMode,
      };

      setResults([newResult, ...results]);
    } catch (error) {
      console.error("Generation error:", error);
      alert("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  const isLocationMode = shootMode === "location";
  const viewMode = getCurrentViewMode();
  const viewLabels: Record<string, string> = { front: "FRONT", back: "BACK", closeup: "CLOSEUP", location: "LOCATION", "location-closeup": "LOC-CLOSE" };

  return (
    <div className="bg-[#121212] text-gray-200 min-h-screen flex flex-col overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ═══ HEADER ═══ */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="font-serif text-2xl tracking-widest text-[#D4AF37] uppercase leading-none">Fashion Master</h1>
            <span className="text-[10px] tracking-[0.3em] text-gray-400 font-light mt-1 uppercase">Haute Couture Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium">Sistem Çevrimiçi</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="hover:text-[#D4AF37] transition-colors text-gray-400"
            >
              <Settings size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MAIN BODY ═══ */}
      <main className="flex flex-1 overflow-hidden">

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="w-72 border-r border-white/5 overflow-y-auto p-4 flex flex-col gap-6 glass-panel shrink-0">

          {/* Çekim Modu */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 font-semibold">Çekim Modu</h3>
            <ViewModeNav mode="shoot" shootMode={shootMode} onShootModeChange={setShootMode} />
          </section>

          {/* Görünüm Seçimi */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 font-semibold">Görünüm Seçimi</h3>
            <ViewModeNav mode="view" shootMode={shootMode} onShootModeChange={setShootMode} />
          </section>

          {/* İşlem Düğümü */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 font-semibold">İşlem Düğümü</h3>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value as AIModelId)}
              disabled={isLoading}
              className="select-field"
            >
              <option value="fal-ai/nano-banana-pro/edit">ANA PROTOKOL v.01 (FAL)</option>
              <option value="fal-ai/fashn/tryon/v1.5" disabled={viewMode !== "front"}>FASHN ÇEKİRDEK 1.5</option>
              <option value="fal-ai/idm-vton" disabled={viewMode !== "front"}>IDM HİBRİT</option>
            </select>
            <p className="text-[9px] text-gray-500 mt-2 italic leading-relaxed">
              * Görünüm moduna göre otomatik optimize edilir.
            </p>
          </section>

          {/* Parametreler */}
          <section className="flex-1">
            <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-3 font-semibold">Parametreler</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Çıktı Kalitesi</label>
                <div className="flex items-center justify-between glass-panel p-2 rounded-sm text-[11px]">
                  <span className="text-[#D4AF37]">✨ 4K Ultra</span>
                  <span className="text-gray-500">Sabit</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Sabit Tohum (Seed)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Rastgele Seçim"
                    value={seed || ""}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="input-field flex-1"
                  />
                  <button className="glass-panel px-2 rounded-sm text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                    <Zap size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[9px] text-gray-500">
              <span>Hız: 2.4s/it</span>
              <span>Sürüm: v4.2.0</span>
            </div>
          </div>
        </aside>

        {/* ─── CENTER WORKSPACE ─── */}
        <section className="flex-1 bg-black/20 overflow-y-auto relative">
          <Routes>
            <Route
              path="*"
              element={
                <ViewPage
                  title={viewMode === "front" ? "Ön Görünüm" : viewMode === "back" ? "Arka Görünüm" : viewMode === "closeup" ? "Yakın Plan" : viewMode === "location" ? "Mekan Çekim" : "Dış Yakın Plan"}
                  subtitle={isLocationMode ? "Dış Mekan Editoryal Modu Aktif" : "Editoryal Ön Çekim Modu Aktif"}
                  viewMode={viewMode}
                  isLoading={isLoading}
                  onGenerate={handleGenerate}
                  canGenerate={!!dressUrl && !!modelUrl}
                  progressMsg={progressMsg}
                  dressUrl={dressUrl}
                  setDressUrl={setDressUrl}
                  modelUrl={modelUrl}
                  setModelUrl={setModelUrl}
                  locationUrl={locationUrl}
                  setLocationUrl={setLocationUrl}
                  isLocationMode={isLocationMode}
                />
              }
            />
          </Routes>
        </section>

        {/* ─── RIGHT SIDEBAR (Archive) ─── */}
        <aside className="w-80 border-l border-white/5 bg-black/40 p-4 flex flex-col overflow-hidden shrink-0">
          <ResultGallery results={results} isLoading={isLoading} />
        </aside>
      </main>

      {/* ═══ BOTTOM STATUS ═══ */}
      <footer className="h-8 bg-black border-t border-white/5 flex items-center px-4 justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Sistem Erişimi
          </span>
          <span className="text-[10px] text-gray-700">|</span>
          <span className="text-[10px] text-gray-500">Çekim Modu: {shootMode.toUpperCase()}</span>
          <span className="text-[10px] text-gray-700">|</span>
          <span className="text-[10px] text-gray-500">Düğüm: {engine.split("/").pop()?.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-gray-500">
          <span>Latans: 42ms</span>
          <span>Oturum ID: FM_07840</span>
        </div>
      </footer>

      {/* ═══ SETTINGS MODAL ═══ */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full glass-panel rounded-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold tracking-tight">Sistem Ayarları</h2>
                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest mb-2 block">Fal.ai API Key</label>
                  <input
                    type="password"
                    value={falKey}
                    onChange={(e) => setFalKey(e.target.value)}
                    placeholder="API Key"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-[#D4AF37] hover:bg-[#A67C00] text-black py-3 rounded-sm font-semibold transition-colors"
                >
                  Kaydet ve Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
