
import React from 'react';
import { useState } from 'react';
import { handleLogin } from '@/services/Authentication';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const base = "https://sales-backend-7q5y.onrender.com"

  const onLoginClick = async () => {
    try {
      // Chama a função externa passando os dados
      const result = await handleLogin(username, password);
      
      if (result) {

        onLogin(); // Notifica o App.tsx (se necessário)
        
        // Redireciona para a rota desejada (ex: /vendas ou /dashboard)
        navigate('/dashboard'); 
      }
    } catch (error) {
      alert("Erro ao entrar: Verifique usuário e senha.");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.02] pointer-events-none rotate-12">
        <span className="material-symbols-outlined text-[600px]">storefront</span>
      </div>
      
      <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-[2.5rem] p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="size-20 bg-primary rounded-3xl flex items-center justify-center text-background-dark shadow-2xl shadow-primary/20 mb-6 group">
            <span className="material-symbols-outlined text-5xl font-black group-hover:scale-110 transition-transform">lock</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            LIDERANÇA <span className="text-primary">CONSTRUÇÕES</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2 italic">ERP ENTERPRISE PLANNING</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-primary transition-colors ml-1">Username / ID</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">person</span>
              <input 
                onChange={(e) => setUsername(e.target.value)}
                type="text" 
                defaultValue=""
                className="w-full bg-background-dark border-border-dark text-white rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-primary transition-colors ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">key</span>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                defaultValue=""
                className="w-full bg-background-dark border-border-dark text-white rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-bold" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-1">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-white transition-colors">
              <input type="checkbox" className="accent-primary rounded" defaultChecked /> Lembrar Acesso
            </label>
          </div>

          <button 
            type="button"
            onClick={onLoginClick}
            className="w-full bg-primary text-background-dark py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            Acessar Sistema
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border-dark text-center">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Acesso Restrito a Colaboradores</p>
          <div className="flex justify-center gap-4 mt-4">
             <div className="size-1.5 rounded-full bg-slate-800"></div>
             <div className="size-1.5 rounded-full bg-slate-800"></div>
             <div className="size-1.5 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
