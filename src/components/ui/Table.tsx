import React from "react";
import { colors, typography, spacing } from "../../theme";

export const Table: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <div className="overflow-x-auto w-full">
    <table style={style} className={`w-full text-left border-collapse ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <thead
    style={{
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      color: colors.textSecondary,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily.sans.join(", "),
      ...style,
    }}
    className={`uppercase tracking-wider ${className}`}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <tbody
    style={{
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.sans.join(", "),
      ...style,
    }}
    className={`divide-y divide-slate-200/80 ${className}`}
  >
    {children}
  </tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <tr
    style={style}
    className={`hover:bg-slate-50/80 transition-colors duration-150 group ${className}`}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties; align?: "left" | "center" | "right" }> = ({
  children,
  className = "",
  style,
  align = "left",
}) => {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th
      style={{ padding: spacing.md, ...style }}
      className={`${alignClass} ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties; align?: "left" | "center" | "right" }> = ({
  children,
  className = "",
  style,
  align = "left",
}) => {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <td
      style={{ padding: spacing.md, ...style }}
      className={`${alignClass} ${className}`}
    >
      {children}
    </td>
  );
};

