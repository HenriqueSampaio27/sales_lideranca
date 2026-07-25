import React from "react";
import { POS_SHORTCUTS } from "../../constants/shortcuts";
import { posColors, borderRadius } from "../../theme";

export const POSShortcutFooter: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: posColors.shortcutBg,
        borderColor: posColors.shortcutBorder,
      }}
      className="p-3 border-t grid grid-cols-4 md:grid-cols-8 gap-2 shadow-sm"
    >
      {POS_SHORTCUTS.map((shortcut, index) => (
        <div
          key={index}
          style={{
            backgroundColor: posColors.cardBg,
            borderColor: posColors.cardBorder,
            borderRadius: borderRadius.lg,
          }}
          className="flex flex-col items-center p-2 border hover:border-amber-400 transition-colors"
        >
          <span
            style={{ color: posColors.shortcutKeyText }}
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5"
          >
            {shortcut.key}
          </span>
          <span
            style={{ color: posColors.textPrimary }}
            className="text-[11px] font-bold uppercase tracking-tighter text-center"
          >
            {shortcut.label}
          </span>
        </div>
      ))}
    </div>
  );
};


