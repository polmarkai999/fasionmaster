import React from "react";
import { Eye, RotateCcw, Focus, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type ShootMode = "studio" | "location";

interface Props {
  shootMode: ShootMode;
  onShootModeChange: (mode: ShootMode) => void;
  mode?: "shoot" | "view";
}

export const ViewModeNav: React.FC<Props> = ({ shootMode, onShootModeChange, mode = "view" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveKey = () => {
    if (location.pathname === "/back") return "back";
    if (location.pathname === "/closeup") return "closeup";
    if (location.pathname === "/location") return "location";
    if (location.pathname === "/location-closeup") return "location-closeup";
    return "front";
  };

  const activeKey = getActiveKey();

  const handleShootModeChange = (m: ShootMode) => {
    onShootModeChange(m);
    if (m === "location") {
      navigate("/location");
    } else {
      if (location.pathname === "/location" || location.pathname === "/location-closeup") {
        navigate("/");
      }
    }
  };

  /* ─── SHOOT MODE TOGGLE ─── */
  if (mode === "shoot") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleShootModeChange("studio")}
          className={`p-3 glass-panel rounded-sm text-center transition-all ${shootMode === "studio" ? "active-gold" : "text-gray-500 hover:text-gray-300"}`}
        >
          <svg className={`w-5 h-5 mx-auto mb-2 ${shootMode === "studio" ? "text-[#D4AF37]" : "opacity-50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px]">Stüdyo</span>
        </button>
        <button
          onClick={() => handleShootModeChange("location")}
          className={`p-3 glass-panel rounded-sm text-center transition-all ${shootMode === "location" ? "active-gold" : "text-gray-500 hover:text-gray-300"}`}
        >
          <svg className={`w-5 h-5 mx-auto mb-2 ${shootMode === "location" ? "text-[#D4AF37]" : "opacity-50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="1.5" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px]">Mekan</span>
        </button>
      </div>
    );
  }

  /* ─── VIEW TABS ─── */
  const studioTabs = [
    { key: "front", path: "/", label: "Ön Görünüm", sublabel: "Editoryal Çekim", icon: <Eye size={16} /> },
    { key: "back", path: "/back", label: "Arka Görünüm", sublabel: "Detaylı Çekim", icon: <RotateCcw size={16} /> },
    { key: "closeup", path: "/closeup", label: "Yakın Plan", sublabel: "Detay Odağı", icon: <Focus size={16} /> },
  ];

  const locationTabs = [
    { key: "location", path: "/location", label: "Mekan Çekim", sublabel: "Dış Mekan Editoryal", icon: <MapPin size={16} /> },
    { key: "location-closeup", path: "/location-closeup", label: "Yakın Plan", sublabel: "Dış Mekan Arka Plan", icon: <Focus size={16} /> },
  ];

  const tabs = shootMode === "studio" ? studioTabs : locationTabs;

  return (
    <div className="flex flex-col gap-2">
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-3 p-2 glass-panel rounded-sm transition-all ${isActive ? "active-gold" : "text-gray-400 hover:bg-white/5"}`}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded ${isActive ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "border border-white/5 text-gray-500"}`}>
              {tab.icon}
            </span>
            <div className="text-left">
              <p className={`text-[11px] font-medium ${isActive ? "text-white" : ""}`}>{tab.label}</p>
              <p className="text-[9px] text-gray-500">{tab.sublabel}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
