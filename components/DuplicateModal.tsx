import { useState } from 'react';
import { motion } from 'motion/react';
import { baseUrl } from '@/services/AuthService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
};

export default function DuplicateModal({ isOpen, onClose, onCreate }: Props) {
  const [form, setForm] = useState({
    client: '',
    cnpj: '',
    document: '',
    dueDate: '',
    value: '',
    status: 'pending'
  });

  const base = baseUrl

  function handleBarcode(code: string) {
    console.log('ENTROU NO HANDLE:', code);

  
    const cleaned = code.replace(/\D/g, '');

  // LINHA DIGITÁVEL
  if (cleaned.length === 47) {
    const value = parseInt(cleaned.slice(-10)) / 100;

    const factor = parseInt(cleaned.slice(33, 37));
    const baseDate = new Date(Date.UTC(1997, 9, 7));
    const dueDate = new Date(baseDate);
    dueDate.setUTCDate(baseDate.getUTCDate() + factor);

    const formattedDate = dueDate.toISOString().split('T')[0];
    
    console.log('DATA FORMATADA:', formattedDate);
    setForm((prev) => ({
      ...prev,
      value: value.toString(),
      dueDate: dueDate.toISOString().split('T')[0],
      document: cleaned
    }));

    return;
  }

  // CÓDIGO DE BARRAS
  if (cleaned.length >= 44) {
    const barcode = cleaned.slice(0, 44);

    const value = parseInt(barcode.slice(9, 19)) / 100;
    const factor = parseInt(cleaned.slice(33, 37));

    const baseDate = new Date(Date.UTC(1997, 9, 7));
    const dueDate = new Date(baseDate);
    dueDate.setUTCDate(baseDate.getUTCDate() + factor);

    const formattedDate = dueDate.toISOString().split('T')[0];
    
    setForm((prev) => ({
      ...prev,
      value: value.toString(),
      dueDate: dueDate.toISOString().split('T')[0],
      document: barcode
    }));

    return;
  }

  console.log('Código inválido');
}

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit() {
    if (!form.client || !form.value || !form.dueDate) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      const response = await fetch(`${base}/duplicates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client: form.client,
          cnpj: form.cnpj,
          document: form.document,
          dueDate: form.dueDate,
          value: Number(form.value),
          status: form.status
        })
      });

      const data = await response.json();

      console.log('Salvo no banco:', data);

      onCreate(data); // atualiza tabela (se tiver)
      onClose(); // fecha modal

    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface-dark p-6 rounded-2xl border border-border-dark w-full max-w-lg shadow-xl"
      >
        
        <h2 className="text-lg font-black mb-4">Nova Duplicata</h2>

        <div className="space-y-4">
          
          <input
            placeholder="Código de barras"
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
            onChange={(e) => {
              const value = e.target.value;

              console.log('digitando:', value);

              if (value.length >= 47) {
                handleBarcode(value);
              }
            }}
          />
          <input
            name="client"
            placeholder="Cliente"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <input
            name="cnpj"
            placeholder="CNPJ"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <input
            name="document"
            placeholder="Documento"
            value={form.document}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <input
            type="number"
            name="value"
            placeholder="Valor"
            value={form.value}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <select
            name="status"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          >
            <option value="pending">Pendente</option>
            <option value="delayed">Atrasado</option>
            <option value="paid">Pago</option>
          </select>

        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-primary text-background-dark px-4 py-2 rounded-lg font-bold text-sm"
          >
            Salvar
          </button>
        </div>

      </motion.div>
    </div>
  );
}
