import React, { useState, useRef } from "react";
import { X, Upload, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadFile } from "../services/falApi";

interface Props {
  label: string;
  onUpload: (url: string) => void;
  isLoading?: boolean;
  type?: "design" | "model" | "location";
}

export const ImageUploader: React.FC<Props> = ({ label, onUpload, isLoading = false, type = "design" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    try {
      setLocalLoading(true);
      const url = URL.createObjectURL(file);
      setPreview(url);
      const falUrl = await uploadFile(file);
      onUpload(falUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("İşlem sırasında hata! Lütfen tekrar deneyin.");
      setPreview(null);
    } finally {
      setLocalLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const IconComponent = type === "model" ? User : Upload;

  return (
    <div
      className={`aspect-[4/5] glass-panel rounded-xl border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative
        ${isDragging ? "border-[#D4AF37]/60 bg-white/[0.03]" : preview ? "border-[#D4AF37]/30 border-solid" : "border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/[0.02]"}
      `}
      onClick={() => !localLoading && !isLoading && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        onChange={onFileChange}
        disabled={localLoading || isLoading}
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full p-3 flex items-center justify-center"
          >
            <img
              src={preview}
              alt="Önizleme"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm text-white/50 hover:text-red-400 flex items-center justify-center transition-colors"
            >
              <X size={14} />
            </button>

            {localLoading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                <svg className="animate-spin h-8 w-8 text-[#D4AF37] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-[10px] text-[#D4AF37]/80 font-semibold tracking-[0.3em] uppercase">Yükleniyor</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 text-center p-6"
          >
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <IconComponent size={28} className="text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium mb-1">Kaynak Seç</p>
            <p className="text-xs text-gray-500 italic">veya sürükle-bırak</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Golden gradient overlay */}
      {!preview && (
        <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-[#D4AF37] to-transparent pointer-events-none" />
      )}
    </div>
  );
};
