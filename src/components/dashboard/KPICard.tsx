import React from "react";
import { motion } from "framer-motion";
import { dashboardTheme } from "../../theme/dashboardTheme";

export interface KPICardProps {
  title: string;
  value: string | number;
  subValue?: string;
  changeText?: string;
  isPositive?: boolean | null;
  comparisonText?: string;
  iconName: string;
  badgeType?: "success" | "warning" | "danger" | "info" | "primary" | "slate";
  index?: number;
  highlightTag?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subValue,
  changeText,
  isPositive = true,
  comparisonText = "vs. período anterior",
  iconName,
  badgeType = "primary",
  index = 0,
  highlightTag,
}) => {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case "danger":
        return {
          bg: dashboardTheme.dangerBg,
          text: dashboardTheme.dangerText,
          border: dashboardTheme.dangerBorder,
        };
      case "warning":
        return {
          bg: dashboardTheme.warningBg,
          text: dashboardTheme.warningText,
          border: dashboardTheme.warningBorder,
        };
      case "success":
        return {
          bg: dashboardTheme.successBg,
          text: dashboardTheme.successText,
          border: dashboardTheme.successBorder,
        };
      case "info":
        return {
          bg: dashboardTheme.infoBg,
          text: dashboardTheme.infoText,
          border: dashboardTheme.infoBorder,
        };
      case "slate":
        return {
          bg: "#F1F5F9",
          text: "#0F172A",
          border: "#CBD5E1",
        };
      case "primary":
      default:
        return {
          bg: dashboardTheme.lightRed,
          text: dashboardTheme.darkRed,
          border: dashboardTheme.borderRed,
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div
          style={{
            backgroundColor: badgeStyle.bg,
            borderColor: badgeStyle.border,
            color: badgeStyle.text,
          }}
          className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-xl font-bold">
            {iconName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {highlightTag && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-wider">
              {highlightTag}
            </span>
          )}

          {changeText && (
            <div
              style={{
                backgroundColor:
                  isPositive === true
                    ? dashboardTheme.successBg
                    : isPositive === false
                    ? dashboardTheme.dangerBg
                    : badgeStyle.bg,
                color:
                  isPositive === true
                    ? dashboardTheme.successText
                    : isPositive === false
                    ? dashboardTheme.dangerText
                    : badgeStyle.text,
                borderColor:
                  isPositive === true
                    ? dashboardTheme.successBorder
                    : isPositive === false
                    ? dashboardTheme.dangerBorder
                    : badgeStyle.border,
              }}
              className="px-2 py-0.5 rounded-lg border text-[11px] font-black flex items-center gap-0.5"
            >
              {isPositive === true && (
                <span className="material-symbols-outlined text-xs">trending_up</span>
              )}
              {isPositive === false && (
                <span className="material-symbols-outlined text-xs">trending_down</span>
              )}
              <span>{changeText}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <p
          style={{ color: dashboardTheme.textSecondary }}
          className="text-[11px] font-extrabold uppercase tracking-wider"
        >
          {title}
        </p>
        <h3
          style={{ color: dashboardTheme.textPrimary }}
          className="text-2xl font-black tracking-tight mt-0.5 truncate"
        >
          {value}
        </h3>
        {subValue && (
          <p className="text-xs font-bold text-slate-600 mt-1 flex items-center gap-1">
            <span>{subValue}</span>
          </p>
        )}
      </div>

      <div
        style={{ borderColor: dashboardTheme.border }}
        className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px]"
      >
        <span
          style={{ color: dashboardTheme.textMuted }}
          className="font-semibold truncate"
        >
          {comparisonText}
        </span>
        <span
          style={{ color: dashboardTheme.primaryRed }}
          className="font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          Análise →
        </span>
      </div>
    </motion.div>
  );
};

