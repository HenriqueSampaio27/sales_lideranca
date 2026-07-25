import React from "react";
import { Client } from "../../types";
import { posColors, borderRadius, shadows } from "../../theme";

interface ClientSearchModalProps {
  isOpen: boolean;
  filteredClients: Client[];
  onClose: () => void;
  onFilterChange: (query: string) => void;
  onSelectClient: (client: Client) => void;
}

export const ClientSearchModal: React.FC<ClientSearchModalProps> = ({
  isOpen,
  filteredClients,
  onClose,
  onFilterChange,
  onSelectClient,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{ backgroundColor: posColors.overlay }}
      className="fixed inset-0 z-[300] backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200"
    >
      <div
        style={{
          backgroundColor: posColors.modalBg,
          borderColor: posColors.modalBorder,
          borderRadius: borderRadius["2xl"],
          boxShadow: shadows.xl,
        }}
        className="w-full max-w-4xl max-h-[90vh] flex flex-col border p-8 relative animate-in zoom-in-95 duration-200"
      >
        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar lista de clientes"
          style={{ color: posColors.textSecondary }}
          className="absolute top-6 right-6 hover:text-red-600 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            style={{ color: posColors.textPrimary }}
            className="text-2xl font-black uppercase tracking-tight italic"
          >
            Lista de <span style={{ color: posColors.primary }}>Clientes</span>
          </h2>
          <p
            style={{ color: posColors.textSecondary }}
            className="text-xs uppercase tracking-widest font-bold mt-1"
          >
            Selecione um cliente para vincular à venda
          </p>
        </div>

        {/* Busca */}
        <div className="mb-6 relative">
          <span
            style={{ color: posColors.primary }}
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
          >
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            style={{
              backgroundColor: posColors.inputBg,
              borderColor: posColors.inputBorder,
              borderRadius: borderRadius.xl,
              color: posColors.textPrimary,
            }}
            className="w-full border py-3.5 pl-12 pr-6 font-bold tracking-tight focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-slate-400"
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2">
          {filteredClients.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-6xl">
                person_off
              </span>
              <p className="mt-4 font-black uppercase tracking-widest text-sm">
                Nenhum cliente encontrado
              </p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  onSelectClient(client);
                  onClose();
                }}
                style={{
                  backgroundColor: posColors.cardBg,
                  borderColor: posColors.cardBorder,
                  borderRadius: borderRadius.xl,
                }}
                className="group p-5 border hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer flex justify-between items-center shadow-xs"
              >
                <div>
                  <p
                    style={{ color: posColors.textPrimary }}
                    className="font-black text-base uppercase tracking-tight group-hover:text-amber-700 transition-colors"
                  >
                    {client.name}
                  </p>
                  <p
                    style={{ color: posColors.textSecondary }}
                    className="text-xs font-bold uppercase tracking-widest mt-0.5"
                  >
                    Documento: {client.cnpj_cpf}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    style={{ color: posColors.primaryHover }}
                    className="font-black text-base font-mono"
                  >
                    {client.phone || "—"}
                  </p>
                  <p
                    style={{ color: posColors.textSecondary }}
                    className="text-xs uppercase tracking-widest mt-0.5"
                  >
                    Cliente
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{ borderColor: posColors.cardBorder }}
          className="mt-6 pt-4 border-t flex justify-between items-center"
        >
          <span
            style={{ color: posColors.textSecondary }}
            className="text-xs font-bold uppercase tracking-widest"
          >
            {filteredClients.length} clientes disponíveis
          </span>

          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: posColors.dangerLight,
              color: posColors.danger,
              borderColor: posColors.dangerBorder,
              borderRadius: borderRadius.xl,
            }}
            className="border px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};


