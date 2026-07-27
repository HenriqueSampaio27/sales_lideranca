import React, { useState, useEffect } from "react";
import { Users, Layers, Download, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Client, ClientFormData } from "../types/client";
import { clientService } from "../services/index";
import { Button } from "../components/ui";
import { colors, borderRadius, typography, shadows } from "../theme";

import ClientCards from "../components/clients/ClientCards";
import ClientFilters from "../components/clients/ClientFilters";
import ClientTable from "../components/clients/ClientTable";
import ClientPagination from "../components/clients/ClientPagination";
import ClientModal from "../components/clients/ClientModal";

const initialClientState: ClientFormData = {
  id: 0,
  name: "",
  phone: "",
  cnpj_cpf: "",
  email: "",
  logradouro: "",
  district: "",
  number: "",
  city: "",
  created_at: "",
};

const ClientManagement: React.FC = () => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("Operação realizada com sucesso.");
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const clientsPerPage = 5;
  const [todayClients, setTodayClients] = useState<string | number>(0);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [client, setClient] = useState<ClientFormData>(initialClientState);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const clearFields = (): void => {
    setEditingClient(null);
    setClient(initialClientState);
  };

  const handleEdit = (clientToEdit: Client): void => {
    setEditingClient(clientToEdit);
    setClient({
      id: clientToEdit.id,
      name: clientToEdit.name,
      phone: clientToEdit.phone || "",
      cnpj_cpf: clientToEdit.cnpj_cpf || "",
      email: clientToEdit.email || "",
      logradouro: clientToEdit.logradouro || "",
      district: clientToEdit.district || "",
      number: clientToEdit.number || "",
      city: clientToEdit.city || "",
      created_at: clientToEdit.created_at || "",
    });
    setIsModalOpen(true);
  };

  const fetchClients = async (): Promise<void> => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const fetchTodayClients = async (): Promise<void> => {
    try {
      const total = await clientService.getTodayClients();
      setTodayClients(total);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchTodayClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (editingClient && editingClient.id) {
        await clientService.updateClient(editingClient.id, client);
        triggerToast("Cliente atualizado com sucesso!");
      } else {
        await clientService.saveClient(client);
        triggerToast("Cliente cadastrado com sucesso!");
      }
      setIsModalOpen(false);
      clearFields();
      await fetchClients();
      await fetchTodayClients();
    } catch (error: unknown) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Tem certeza que deseja deletar este cliente?")) return;
    try {
      await clientService.deleteClient(id);
      triggerToast("Cliente excluído com sucesso.");
      await fetchClients();
      await fetchTodayClients();
    } catch (error: unknown) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  const handleOpenNewModal = (): void => {
    clearFields();
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    clearFields();
  };

  // Filtered clients list
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.cnpj_cpf && c.cnpj_cpf.includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  });

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="min-h-screen p-4 sm:p-6 lg:p-8"
    >
      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingClient={editingClient}
        client={client}
        setClient={setClient}
        onSubmit={handleSubmit}
        onClear={clearFields}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ borderColor: colors.border }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-6"
        >
          <div>
            <div
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: borderRadius.full,
                color: colors.primary,
                boxShadow: shadows.sm,
              }}
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold mb-3"
            >
              <Layers style={{ color: colors.primary }} className="w-3.5 h-3.5" />
              <span>Liderança Construções</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic mb-2" style={{ color: colors.textPrimary }}>
              cadastro de <span style={{ color: colors.primary }}>clientes</span>
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.sm,
              }}
              className="mt-1 font-normal max-w-2xl"
            >
              Registre novos clientes e gerencie sua base de dados corporativa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => alert("Exportação de dados iniciada!")}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenNewModal}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Novo Cadastro</span>
            </Button>
          </div>
        </motion.div>

        {/* CARDS / STATS */}
        <ClientCards
          totalClients={clients.length}
          activeClients={clients.length}
          todayClients={todayClients}
        />

        {/* FILTERS AND SEARCH */}
        <ClientFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenModal={handleOpenNewModal}
          refreshClients={fetchClients}
        />

        {/* TABLE AND PAGINATION WRAPPER */}
        <div
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius["2xl"],
            boxShadow: shadows.sm,
          }}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <ClientTable
            currentClients={currentClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <ClientPagination
            currentPage={currentPage}
            totalClients={filteredClients.length}
            clientsPerPage={clientsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.primary,
              borderLeftWidth: "4px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: borderRadius.xl,
              boxShadow: shadows.xl,
            }}
            className="fixed bottom-6 right-6 z-50 p-4 flex items-center gap-4 min-w-[320px]"
          >
            <div
              style={{
                backgroundColor: colors.primaryLight,
                borderRadius: borderRadius.full,
              }}
              className="p-2.5 flex items-center justify-center text-amber-600 shrink-0"
            >
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p
                style={{
                  color: colors.textPrimary,
                  fontWeight: typography.fontWeight.bold,
                  fontSize: typography.fontSize.sm,
                }}
              >
                Sucesso!
              </p>
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.fontSize.xs,
                }}
              >
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientManagement;
