
import React, { useState, useRef, useEffect } from 'react';

const ClientManagement: React.FC = () => {
  
  const formRef = useRef<HTMLFormElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;
  const [todayClients, setTodayClients] = useState("")
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialClient = {
    id: "",
    name: "",
    phone: "",
    cnpj_cpf: "",
    email: "",
    logradouro: "",
    district: "",
    number: "",
    city: "",
  };
  const [client, setClient] = useState(initialClient);

  function clearFields() {
    if(editingClient){
      setEditingClient(null)
      setClient(initialClient);
    }else{
      setClient(initialClient);
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client);
    setClient(client); // preenche o formulário
  };

  async function saveClient(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar cliente");
      }
      setShowToast(true);

      // 🔥 some sozinho depois de 3 segundos
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      clearFields();
      await fetchClients();
      //const data = await response.json();
      //console.log("Cliente salvo:", data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (editingClient) {
      // ✏️ EDITAR
      await fetch(`http://localhost:5000/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
    } else {
      // ➕ CRIAR
      saveClient(e)
    }

    setEditingClient(null);
    setClient(initialClient);
    fetchClients();
  };


  async function fetchClients() {
    try {
      const response = await fetch("http://localhost:5000/clients");

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => {
        // Converte as datas para milissegundos
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setClients(sortedData); 
      
    } catch (error) {
      console.error(error);
    }
  }

  const deleteClient = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    
    await fetch(`http://localhost:5000/clients/${id}`, {
      method: 'DELETE'
    });

    fetchClients(); // atualiza lista
  };

  function formatCpfCnpj(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a,b,c,d) => {
        return `${a}.${b}.${c}${d ? '-' + d : ''}`;
      });
    } else {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, a,b,c,d,e) => {
        return `${a}.${b}.${c}/${d}${e ? '-' + e : ''}`;
      });
    }
  }

  function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 10) {
      // Telefone fixo (10 dígitos)
      return digits.replace(
        /(\d{2})(\d{4})(\d{0,4})/,
        (_, a, b, c) => {
          return `(${a}) ${b}${c ? '-' + c : ''}`;
        }
      );
    } else {
      // Celular (11 dígitos)
      return digits.replace(
        /(\d{2})(\d{5})(\d{0,4})/,
        (_, a, b, c) => {
          return `(${a}) ${b}${c ? '-' + c : ''}`;
        }
      );
    }
  }


  useEffect(() => {
    fetchClients();
    fetch('http://localhost:5000/clients/today')
    .then(res => res.json())
    .then(data => setTodayClients(data.total));
  }, []);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(clients.length / clientsPerPage);

  return (
    <div className="p-8 space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-dark pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Gestão de Clientes</h1>
          <p className="text-slate-500 mt-2 font-medium uppercase tracking-tight text-xs">Registre novos clientes e gerencie sua base de dados corporativa.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-accent-dark hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl">
          <span className="material-symbols-outlined text-lg">download</span> Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-primary group-hover:w-2 transition-all"></div>
             <div className="flex items-center gap-4 mb-10 pb-4 border-b border-border-dark">
                <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Novo Cadastro</h2>
             </div>
             <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">Nome Completo / Razão Social</label>
                  <input 
                  value={client.name}
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                    }
                    className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-bold" placeholder="Ex: João da Silva ou Mateus Supermercados" type="text"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">Logradouro</label>
                    <input onChange={(e) =>
                      setClient({ ...client, logradouro: e.target.value })
                      }
                      value={client.logradouro}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-mono font-bold" placeholder="Rua Fernando Sarney" type="text"/>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">Número</label>
                    <input onChange={(e) =>
                      setClient({ ...client, number: e.target.value })
                      } 
                      value={client.number}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-mono font-bold" placeholder="25" type="text"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">Bairro</label>
                    <input onChange={(e) =>
                      setClient({ ...client, district: e.target.value })
                      } 
                      value={client.district}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-mono font-bold" placeholder="Vila Marcone" type="text"/>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">cidade</label>
                    <input onChange={(e) =>
                      setClient({ ...client, city: e.target.value })
                      } 
                      value={client.city}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-mono font-bold" placeholder="Santa Inês-MA" type="text"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">CPF / CNPJ</label>
                    <input 
                    onChange={(e) => {
                      const value = e.target.value;
                      setClient({ ...client, cnpj_cpf: formatCpfCnpj(value) })
                      }}
                      maxLength={18}
                      value={client.cnpj_cpf}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-mono font-bold" placeholder="000.000.000-00" type="text"/>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">Telefone</label>
                    <input onChange={(e) =>
                      setClient({ ...client, phone: formatTelefone(e.target.value)})
                      } 
                      maxLength={15}
                      value={client.phone}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-mono font-bold" placeholder="(98) 99999-9999" type="text"/>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">E-mail</label>
                  <input onChange={(e) =>
                      setClient({ ...client, email: e.target.value })
                      } 
                      value={client.email}
                      className="w-full bg-background-dark border-border-dark text-white rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700 font-bold" placeholder="cliente@email.com" type="email"/>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="submit" 
                  className="flex-1 py-4 bg-primary hover:brightness-110 text-background-dark font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined font-black">save</span> 
                      {editingClient ? 'Atualizar Cliente' : 'Salvar Cliente'}

                  </button>
                  <button 
                    type="button"
                    onClick={clearFields} 
                    className="px-8 py-4 bg-transparent border border-border-dark text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs rounded-xl transition-all">
                    {editingClient ? 'Cancelar edição' : 'Limpar'}
                  </button>
                </div>
             </form>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center gap-5 shadow-xl group hover:border-emerald-500/30 transition-all">
              <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">trending_up</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Novos Hoje</p>
                <p className="text-2xl font-black text-white leading-none">{todayClients}</p>
              </div>
            </div>
            <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center gap-5 shadow-xl group hover:border-primary/30 transition-all">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">groups</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Total Base</p>
                <p className="text-2xl font-black text-white leading-none">{clients.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-surface-dark border border-border-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
             <div className="px-8 py-6 border-b border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-black/20">
                <div className="flex items-center gap-4">
                   <button onClick={() => fetchClients()}>
                    <span className="material-symbols-outlined text-slate-500 text-3xl">history</span>
                    </button>
                   <h2 className="text-xl font-black text-white uppercase tracking-tight">Cadastros Recentes</h2>
                   
                </div>
              
                <div className="flex items-center gap-2 bg-background-dark/50 rounded-xl p-1.5 border border-border-dark">
                   <input
                      type="text"
                      placeholder="Pesquisar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-2 sm:mt-0 sm:ml-auto px-4 py-2 rounded-xl bg-background-dark border border-border-dark text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
             </div>
             <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/30 border-b border-border-dark">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Cliente</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] hidden md:table-cell">Documento</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] hidden sm:table-cell">Contato</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark">
                    {currentClients
                    .filter(client =>
                        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        client.cnpj_cpf?.includes(searchTerm)
                      )
                    .map((client) => (
                      <tr key={client.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-2 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{client.name}</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase mt-1 tracking-widest">Desde {new Date(client.created_at).toLocaleString("pt-BR")}</span>
                          </div>
                        </td>
                        <td className="px-4 py-6 hidden md:table-cell">
                          <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest">{client.cnpj_cpf}</span>
                        </td>
                        <td className="px-4 py-6 hidden sm:table-cell">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-300 font-bold tracking-tighter">{client.phone}</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase mt-1 tracking-widest">{client.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button type="button" onClick={() => handleEdit(client)} className="size-9 rounded-xl bg-background-dark border border-border-dark text-slate-500 hover:text-primary hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button type="button" onClick={() => deleteClient(client.id)} className="size-9 rounded-xl bg-background-dark border border-border-dark text-slate-500 hover:text-rose-500 hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
             <div className="px-8 py-6 bg-black/30 border-t border-border-dark flex items-center justify-between">
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Exibindo {indexOfFirstClient + 1} - {Math.min(indexOfLastClient, clients.length)} de {clients.length} clientes</span>
                <div className="flex gap-2">
                   <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage((prev) => prev - 1)}
                   
                   className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-background-dark text-slate-500 rounded-lg border border-border-dark hover:text-white transition-all">Anterior</button>
                   <button disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-background-dark text-white rounded-lg border border-border-dark hover:bg-primary hover:text-background-dark transition-all">Próximo</button>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification Simulation */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right duration-700">
          <div className="bg-surface-dark border-l-4 border-primary p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 min-w-[340px] border border-border-dark">
            <div className="bg-primary/20 size-12 rounded-full flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-primary text-2xl font-black">check_circle</span>
            </div>
            <div>
              <p className="text-base font-black text-white uppercase tracking-tight">Pronto!</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Operação realizada com sucesso.</p>
            </div>
            <button className="ml-auto text-slate-600 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
