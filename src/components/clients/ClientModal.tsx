import React from "react";
import { UserPlus, Save, X } from "lucide-react";
import { Client, ClientFormData } from "../../types/client";
import { Modal, Input, Button } from "../ui";
import { colors, typography } from "../../theme";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClient: Client | null;
  client: ClientFormData;
  setClient: React.Dispatch<React.SetStateAction<ClientFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export const formatCpfCnpj = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d) => {
      return `${a}.${b}.${c}${d ? '-' + d : ''}`;
    });
  } else {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, a, b, c, d, e) => {
      return `${a}.${b}.${c}/${d}${e ? '-' + e : ''}`;
    });
  }
};

export const formatTelefone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) => {
      return `(${a}) ${b}${c ? '-' + c : ''}`;
    });
  } else {
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) => {
      return `(${a}) ${b}${c ? '-' + c : ''}`;
    });
  }
};

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  editingClient,
  client,
  setClient,
  onSubmit,
  onClear,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingClient ? "Editar Cliente" : "Novo Cadastro de Cliente"}
      subtitle={
        editingClient
          ? "Atualize as informações do cliente abaixo."
          : "Preencha os dados do cliente para adicioná-lo à base corporativa."
      }
      icon={<UserPlus className="w-5 h-5 text-amber-600" />}
      maxWidth="3xl"
    >
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Nome */}
        <div className="space-y-1.5">
          <label
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
            }}
            className="uppercase tracking-wider"
          >
            Nome Completo / Razão Social
          </label>
          <Input
            value={client.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setClient({ ...client, name: e.target.value })
            }
            placeholder="Ex: João da Silva ou Mateus Supermercados"
            required
          />
        </div>

        {/* Logradouro e Número */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
              className="uppercase tracking-wider"
            >
              Logradouro
            </label>
            <Input
              value={client.logradouro}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setClient({ ...client, logradouro: e.target.value })
              }
              placeholder="Ex: Rua Fernando Sarney"
            />
          </div>
          <div className="space-y-1.5">
            <label
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
              className="uppercase tracking-wider"
            >
              Número
            </label>
            <Input
              value={client.number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setClient({ ...client, number: e.target.value })
              }
              placeholder="Ex: 25"
            />
          </div>
        </div>

        {/* Bairro e Cidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
              className="uppercase tracking-wider"
            >
              Bairro
            </label>
            <Input
              value={client.district}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setClient({ ...client, district: e.target.value })
              }
              placeholder="Ex: Vila Marcone"
            />
          </div>
          <div className="space-y-1.5">
            <label
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
              className="uppercase tracking-wider"
            >
              Cidade
            </label>
            <Input
              value={client.city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setClient({ ...client, city: e.target.value })
              }
              placeholder="Ex: Santa Inês-MA"
            />
          </div>
        </div>

        {/* CPF/CNPJ e Telefone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
              className="uppercase tracking-wider"
            >
              CPF / CNPJ
            </label>
            <Input
              value={client.cnpj_cpf}
              maxLength={18}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setClient({ ...client, cnpj_cpf: formatCpfCnpj(e.target.value) })
              }
              placeholder="000.000.000-00"
            />
          </div>
          <div className="space-y-1.5">
            <label
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
              className="uppercase tracking-wider"
            >
              Telefone
            </label>
            <Input
              value={client.phone}
              maxLength={15}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setClient({ ...client, phone: formatTelefone(e.target.value) })
              }
              placeholder="(98) 99999-9999"
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="space-y-1.5">
          <label
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
            }}
            className="uppercase tracking-wider"
          >
            E-mail
          </label>
          <Input
            type="email"
            value={client.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setClient({ ...client, email: e.target.value })
            }
            placeholder="cliente@email.com"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            <X className="w-4 h-4 mr-1.5" />
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            <Save className="w-4 h-4 mr-1.5" />
            {editingClient ? "Atualizar Cliente" : "Salvar Cliente"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;
