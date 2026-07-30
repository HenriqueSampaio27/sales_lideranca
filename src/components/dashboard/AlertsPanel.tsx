import React from "react";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { AlertItem } from "../../types/dashboard";

interface AlertsPanelProps {
  alerts: AlertItem[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getSeverityStyles = (type: AlertItem["type"]) => {
    switch (type) {
      case "critical":
        return {
          bg: dashboardTheme.dangerBg,
          border: dashboardTheme.dangerBorder,
          text: dashboardTheme.dangerText,
          badgeBg: "#DC2626",
          badgeText: "#FFFFFF",
          icon: "error",
        };
      case "warning":
        return {
          bg: dashboardTheme.warningBg,
          border: dashboardTheme.warningBorder,
          text: dashboardTheme.warningText,
          badgeBg: "#D97706",
          badgeText: "#FFFFFF",
          icon: "warning",
        };
      case "normal":
      default:
        return {
          bg: dashboardTheme.successBg,
          border: dashboardTheme.successBorder,
          text: dashboardTheme.successText,
          badgeBg: "#16A34A",
          badgeText: "#FFFFFF",
          icon: "check_circle",
        };
    }
  };

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: dashboardTheme.primaryRed }}
              className="material-symbols-outlined text-xl"
            >
              notifications_active
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Alertas Importantes
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Notificações em tempo real sobre ocorrências do sistema
          </p>
        </div>

        <span
          style={{
            backgroundColor: dashboardTheme.lightRed,
            color: dashboardTheme.darkRed,
          }}
          className="px-2.5 py-1 rounded-lg text-xs font-black"
        >
          {alerts.length} Notificações
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[380px]">
        {alerts.map((alert) => {
          const style = getSeverityStyles(alert.type);
          return (
            <div
              key={alert.id}
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
              }}
              className="p-4 rounded-xl border flex items-start gap-3 transition-all hover:scale-[1.01]"
            >
              <div
                style={{
                  backgroundColor: style.badgeBg,
                  color: style.badgeText,
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-lg">
                  {alert.iconName || style.icon}
                </span>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    style={{ color: dashboardTheme.textPrimary }}
                    className="text-xs font-black truncate"
                  >
                    {alert.title}
                  </h4>
                  <span
                    style={{
                      backgroundColor: style.badgeBg,
                      color: style.badgeText,
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0"
                  >
                    {alert.badgeText}
                  </span>
                </div>

                <p
                  style={{ color: dashboardTheme.textSecondary }}
                  className="text-xs font-medium mt-1 leading-snug"
                >
                  {alert.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                  <span style={{ color: style.text }}>
                    {alert.countOrValue}
                  </span>
                  <button
                    type="button"
                    style={{ color: dashboardTheme.primaryRed }}
                    className="hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Resolver</span>
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
