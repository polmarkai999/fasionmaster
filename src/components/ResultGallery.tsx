import React, { useState } from "react";
import { Download, Maximize2, X, Clock, ExternalLink, Zap, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GenerationResult {
  id: string;
  url: string;
  timestamp: string;
  engine: string;
  seed: number;
  viewMode?: string;
}

interface Props {
  results: GenerationResult[];
  isLoading?: boolean;
}

export const ResultGallery: React.FC<Props> = ({ results, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<GenerationResult | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { method: 'GET', mode: 'cors', headers: { 'Origin': window.location.origin } });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-[9px] font-bold text-[#c5a059] uppercase tracking-[0.15em]">ARŞİV</h3>
        <span className="text-[8px] font-semibold text-white/15 tracking-wider">
          {results.length} ÇIKTI
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3 flex-shrink-0">
        <button className="px-3 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-wider bg-[#c5a059]/10 text-[#c5a059]/70 border border-[#c5a059]/20">
          ARŞİV
        </button>
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="popLayout">
          {/* Empty State */}
          {results.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-12"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                <LayoutGrid size={18} className="text-white/8" />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.3em]">Henüz Sonuç Yok</p>
                <p className="text-[8px] text-white/8 mt-1 leading-relaxed">Üretim başlatıldığında sonuçlar burada görünecek</p>
              </div>
            </motion.div>
          )}

          {/* Result Cards */}
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer mb-3"
              onClick={() => setSelectedImage(result)}
            >
              <div className="card-glass relative aspect-[3/4] overflow-hidden bg-[#050508] group-hover:border-[#c5a059]/15 transition-all">
                <img src={result.url} alt="Üretim" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(result); }}
                      className="w-8 h-8 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors"
                    >
                      <Maximize2 size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadImage(result.url, `fm-${result.id}.png`); }}
                      className="w-8 h-8 bg-[#c5a059]/20 backdrop-blur rounded-lg flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059]/30 transition-colors"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-1.5 px-0.5 flex items-center gap-1.5">
                <Clock size={8} className="text-white/10" />
                <span className="text-[7px] text-white/15 font-semibold">{result.timestamp}</span>
                <Zap size={7} className="text-[#c5a059]/40 ml-auto" />
                <span className="text-[7px] text-[#c5a059]/30 font-semibold">{result.viewMode === 'back' ? 'Arka' : result.viewMode === 'closeup' ? 'Detay' : result.viewMode === 'location' ? 'Mekan' : 'Ön'}</span>
              </div>
            </motion.div>
          ))}

          {/* Loading */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glass border-dashed border-white/[0.06] overflow-hidden"
            >
              <div className="aspect-[3/4] bg-[#050508] flex flex-col items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Zap size={16} className="text-[#c5a059]/40" />
                </motion.div>
                <span className="text-[8px] text-white/10 font-bold tracking-[0.3em] uppercase mt-3">Sentezleniyor</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Fullscreen Modal ─── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-8 backdrop-blur-2xl"
            onClick={() => { setSelectedImage(null); setIsZoomed(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-all z-50"
              >
                <X size={18} />
              </button>

              <div
                className="relative w-full flex justify-center bg-black/30 p-3 border border-white/[0.04] rounded-2xl overflow-hidden cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
              >
                <motion.img
                  src={selectedImage.url}
                  alt="Tam Ekran"
                  animate={{ scale: isZoomed ? 2 : 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`object-contain rounded-xl ${isZoomed ? "max-h-[150vh] cursor-zoom-out" : "max-h-[70vh] cursor-zoom-in"}`}
                />
              </div>

              <div className="w-full max-w-lg mt-6 p-5 card-glass flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[#c5a059]/50 text-[8px] font-bold uppercase tracking-widest">Düğüm</p>
                    <p className="text-white/70 font-bold text-xs uppercase">{selectedImage.engine}</p>
                  </div>
                  <div className="w-[1px] h-6 bg-white/[0.06]" />
                  <div>
                    <p className="text-[#c5a059]/50 text-[8px] font-bold uppercase tracking-widest">Seed</p>
                    <p className="text-white/50 font-mono text-xs">{selectedImage.seed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadImage(selectedImage.url, `fm-${selectedImage.id}.png`)}
                    className="btn-primary text-[10px] py-2 px-4"
                  >
                    İndir
                  </button>
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-white/30 hover:text-white transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
