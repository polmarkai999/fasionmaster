import React from "react";
import { Wand2, Zap } from "lucide-react";
import { AIModelId, ViewMode } from "../services/falApi";

interface Props {
  selected: AIModelId;
  onSelect: (id: AIModelId) => void;
  isLoading?: boolean;
  viewMode?: ViewMode;
  variant?: "default" | "sidebar";
}

export const EngineSelector: React.FC<Props> = ({ selected, onSelect, isLoading, viewMode = "front", variant = "default" }) => {
  const engines = [
    { id: "fal-ai/nano-banana-pro/edit", name: "ANA PROTOKOL v01 (FAL)", shortName: "ANA PROTOKOL v.01", supportsAllViews: true },
    { id: "fal-ai/fashn/tryon/v1.5", name: "FASHN ÇEKİRDEK 1.5", shortName: "FASHN 1.5", supportsAllViews: false },
    { id: "fal-ai/idm-vton", name: "IDM HİBRİT", shortName: "IDM HİBRİT", supportsAllViews: false },
  ];

  const isNonFrontView = viewMode !== "front";

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value as AIModelId)}
          disabled={isLoading}
          className="custom-select pr-8"
        >
          {engines.map((e) => (
            <option key={e.id} value={e.id} disabled={isNonFrontView && !e.supportsAllViews}>
              {e.name}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/15">
          <Wand2 size={11} />
        </div>
      </div>
      <p className="text-[7px] text-white/15 italic leading-relaxed px-0.5">
        * Görünüm moduna göre otomatik optimize edilir.
      </p>
    </div>
  );
};
