import React, { useState } from "react";
import { handleLogin } from "../services/Authentication";
import { useNavigate } from "react-router-dom";
import { sidebarColors } from "../theme";

interface LoginProps {
  onLogin?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLoginClick = async () => {
    setLoading(true);
    try {
      const result = await handleLogin(username, password);

      if (result) {
        onLogin?.();
        navigate("/pos");
      }
    } catch {
      alert("Erro ao entrar: Verifique usuário e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F8FAFC",
        color: sidebarColors.textPrimary,
      }}
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans select-none"
    >
      {/* Background watermark pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-40 opacity-[0.03] pointer-events-none rotate-12">
        <span className="material-symbols-outlined text-[600px] text-slate-800">
          storefront
        </span>
      </div>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E2E8F0",
        }}
        className="w-full max-w-md border rounded-3xl p-10 shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-500"
      >
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div
            style={{
              backgroundColor: sidebarColors.primary,
              borderColor: sidebarColors.primary,
              color: sidebarColors.badgeBorder,
            }}
            className="w-16 h-16 rounded-2xl border flex items-center justify-center shadow-xs mb-5 group"
          >
            <span className="material-symbols-outlined text-3xl font-bold group-hover:scale-110 transition-transform duration-300">
              lock
            </span>
          </div>

          <h1
            style={{ color: sidebarColors.textPrimary }}
            className="text-2xl font-black uppercase tracking-tight leading-tight"
          >
            Liderança <span style={{ color: sidebarColors.primary }}>Construções</span>
          </h1>
          <p
            style={{ color: sidebarColors.textSecondary }}
            className="text-[11px] font-bold uppercase tracking-widest mt-1.5"
          >
            Sistema de Gestão ERP
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLoginClick();
          }}
          className="space-y-5"
        >
          <div className="space-y-1.5 group">
            <label
              style={{ color: sidebarColors.textSecondary }}
              className="text-[11px] font-black uppercase tracking-wider ml-1 group-focus-within:text-[#FFFFFF] transition-colors"
            >
              Usuário / ID
            </label>
            <div className="relative">
              <span
                style={{ color: sidebarColors.textMuted }}
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl"
              >
                person
              </span>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Informe seu usuário"
                style={{
                  backgroundColor: "#F8FAFC",
                  borderColor: "#E2E8F0",
                  color: sidebarColors.textPrimary,
                }}
                className="w-full border rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#FFFFFF] focus:bg-white focus:ring-2 focus:ring-[#FEF3C7] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label
              style={{ color: sidebarColors.textSecondary }}
              className="text-[11px] font-black uppercase tracking-wider ml-1 group-focus-within:text-[#FF0000] transition-colors"
            >
              Senha
            </label>
            <div className="relative">
              <span
                style={{ color: sidebarColors.textMuted }}
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl"
              >
                key
              </span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                style={{
                  backgroundColor: "#F8FAFC",
                  borderColor: "#E2E8F0",
                  color: sidebarColors.textPrimary,
                }}
                className="w-full border rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#FF0000] focus:bg-white focus:ring-2 focus:ring-[#FEF3C7] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold px-1 py-1">
            <label
              style={{ color: sidebarColors.textSecondary }}
              className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A] transition-colors"
            >
              <input
                type="checkbox"
                className="accent-[#FF0000] rounded w-4 h-4"
                defaultChecked
              />
              <span>Lembrar meu acesso</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: sidebarColors.primary,
              color: "#FFFFFF",
            }}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-md hover:bg-[#B45210] active:scale-[0.99] transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Acessando...</span>
            ) : (
              <>
                <span>Acessar Sistema</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div
          style={{ borderColor: "#E2E8F0" }}
          className="mt-8 pt-6 border-t text-center"
        >
          <p
            style={{ color: sidebarColors.textSecondary }}
            className="text-[11px] font-bold uppercase tracking-wider"
          >
            Acesso Restrito a Colaboradores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

