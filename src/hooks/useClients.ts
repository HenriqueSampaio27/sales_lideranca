import { useState, useCallback } from "react";
import { Client } from "../types";
import { ClientService } from "../services/ClientService";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchClient, setSearchClient] = useState("");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const data = await ClientService.fetchClients();
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  }, []);

  const searchClientByDocument = useCallback(async (doc: string) => {
    try {
      const found = await ClientService.searchClientByDocument(doc);
      if (found) {
        setSelectedClient(found);
      } else {
        alert("Cliente não encontrado");
      }
    } catch (err) {
      console.error("Erro ao buscar cliente por documento:", err);
    }
  }, []);

  const filterClients = useCallback(
    (query: string) => {
      const value = query.toLowerCase();
      if (!value) {
        setFilteredClients(clients);
        return;
      }
      const filtered = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(value) || c.cnpj_cpf.includes(value)
      );
      setFilteredClients(filtered);
    },
    [clients]
  );

  return {
    clients,
    filteredClients,
    selectedClient,
    setSelectedClient,
    searchClient,
    setSearchClient,
    isClientModalOpen,
    setIsClientModalOpen,
    fetchClients,
    searchClientByDocument,
    filterClients,
  };
}
