import { useState } from 'react';
import { motion } from 'motion/react';
import { baseUrl } from '@/services/AuthService';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
};

export default function ExpensesModal({ isOpen, onClose, onCreate }: Props) {
  const [form, setForm] = useState({
    name: '',
    value: '',
    due_date: ''
  });

  const base = baseUrl

  async function handleSubmit() {
    if (!form.name || !form.value || !form.value) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      const response = await fetch(`${base}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          value: Number(form.value),
          due_date: (form.due_date)
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
            name="name"
            placeholder="Nome"
            onChange={(e) =>
                    setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <input
            type="number"
            name="value"
            placeholder="Valor"
            value={form.value}
            onChange={(e) =>
                    setForm({ ...form, value: e.target.value })}
            className="w-full p-3 rounded-lg bg-background-dark border border-border-dark"
          />

          <input
            type="date"
            name="dueDate"
            value={form.due_date}
            onChange={(e) =>
                    setForm({ ...form, due_date: e.target.value })}
            className="w-full p-3 rounded -lg bg-background-dark border border-border-dark"
          />

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
