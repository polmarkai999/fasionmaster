import React from "react";
import { Camera, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageUploader } from "../components/ImageUploader";

interface ViewPageProps {
  title: string;
  subtitle: string;
  viewMode: string;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  progressMsg: string;
  dressUrl: string;
  setDressUrl: (url: string) => void;
  modelUrl: string;
  setModelUrl: (url: string) => void;
  locationUrl: string;
  setLocationUrl: (url: string) => void;
  isLocationMode: boolean;
}

export const ViewPage: React.FC<ViewPageProps> = ({
  title,
  subtitle,
  viewMode,
  isLoading,
  onGenerate,
  canGenerate,
  progressMsg,
  setDressUrl,
  setModelUrl,
  setLocationUrl,
  isLocationMode,
}) => {
  return (
    <div className="p-8">
      {/* Top Title Bar */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-white tracking-tight">{title}</h2>
          <p className="text-sm text-[#D4AF37]/80 font-light mt-1 flex items-center">
            <Camera size={16} className="mr-2" />
            {subtitle}
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || !canGenerate}
          className="bg-[#D4AF37] hover:bg-[#A67C00] disabled:opacity-30 disabled:cursor-not-allowed text-black px-8 py-3 rounded-full flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-[#D4AF37]/20 font-semibold group"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Üretiliyor...</span>
            </>
          ) : (
            <>
              <span>Üretimi Başlat</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Upload Zones Grid */}
      <div className={`grid gap-8 ${isLocationMode ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"}`}>
        {/* Tasarım Girişi */}
        <div className="flex flex-col">
          <label className="text-[11px] uppercase tracking-widest text-gray-400 mb-4 font-medium flex justify-between">
            <span>Tasarım Girişi</span>
            <span className="text-[#D4AF37]/60 italic font-normal">Giysi Referansı</span>
          </label>
          <ImageUploader label="" onUpload={setDressUrl} isLoading={isLoading} type="design" />
        </div>

        {/* Manken Girişi */}
        <div className="flex flex-col">
          <label className="text-[11px] uppercase tracking-widest text-gray-400 mb-4 font-medium flex justify-between">
            <span>Manken Girişi</span>
            <span className="text-[#D4AF37]/60 italic font-normal">Model Konsepti</span>
          </label>
          <ImageUploader label="" onUpload={setModelUrl} isLoading={isLoading} type="model" />
        </div>

        {/* Mekan Girişi (location only) */}
        {isLocationMode && (
          <div className="flex flex-col">
            <label className="text-[11px] uppercase tracking-widest text-gray-400 mb-4 font-medium flex justify-between">
              <span>Mekan Girişi</span>
              <span className="text-[#D4AF37]/60 italic font-normal">Dış Mekan</span>
            </label>
            <ImageUploader label="" onUpload={setLocationUrl} isLoading={isLoading} type="location" />
          </div>
        )}
      </div>

      {/* Live Log Overlay */}
      <div className="mt-8 glass-panel rounded p-4 font-mono text-[10px] text-gray-400 border-l-2 border-l-[#D4AF37]">
        <div className="flex gap-4 mb-2">
          <span className={isLoading ? "text-yellow-500" : "text-green-500"}>
            {isLoading ? "Üretim Aktif" : "Giriş İçin Hazır"}
          </span>
          <span>Sunucu: Optimal</span>
          <span className="text-[#D4AF37]">Mod: {viewMode.toUpperCase()}</span>
        </div>
        <div>{isLoading ? progressMsg : "Düğüm: EDIT"}</div>
        <div>FM_20260310_SESSION_INIT...</div>
      </div>

      {/* Progress Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[400px] z-50 pointer-events-none"
          >
            <div className="glass-panel rounded p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#D4AF37] uppercase tracking-widest">
                <span>{progressMsg}</span>
                <span className="animate-pulse">ÜRETİM_FAZI</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#D4AF37] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
