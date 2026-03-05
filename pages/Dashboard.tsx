import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_PRODUCTS, MOCK_SALES, CHART_DATA } from '../constants';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3, 
  Terminal,
  Search,
  Filter,
  Download,
  Calendar,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { Form } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<keyof typeof CHART_DATA>('30d');
  const [chartData, setChartData] = useState<any[]>([]);
  const [qntEmpty, setQntEmpty] = useState(0)
  const [qntLow, setQntLow] = useState(0)
  const [valueStock, setValueStock] = useState("")
  const [totalBilled, setTotalBilled] = useState(0)
  const [totalPaid, setTotalPaid] = useState("")
  const [totalPedding, setTotalPedding] = useState("")
  const [estimated, setEstimated] = useState("")

  const formatCurrencyCompact = (value: number): string  => {
  const abs = Math.abs(value)

  // Até 999.999,99 → formato normal
  if (abs < 1_000_000) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // 1.000.000+ → milhões
  const millions = value / 1_000_000

  return `R$ ${millions.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/product");

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const data = await response.json();
      
      //const subTotal =  cart.reduce((acc, item) => acc + (item.qty * item.unit), 0);
      const value = formatCurrencyCompact(data.reduce((acc, item) => acc + Number(item.price_cost), 0))
      let stock = 0
      let minStock = 0
      
      data.map((item) => {
        if(Number(item.stock) <= Number(item.minStock)){
          minStock += 1
        }
        if(Number(item.stock) == 0){
          stock += 1
        }
      })
      setValueStock(value)
      setQntEmpty(stock)
      setQntLow(minStock)

    } catch (error) {
      console.error(error);
    }
  };

  const getInvoiceSummary = async () => {
    try {
      const response = await fetch("http://localhost:5000/invoices");

      if (!response.ok) {
        throw new Error("Erro ao buscar notas");
      }

      const data = await response.json();
      const totalSales = data.length
      let paid = 0
      let pedding = 0

      data.map((item) => {
        if(item.status == "PAGO" && item.total_amount != "NaN" ){
          paid += Number(item.total_amount)
        }
      })
      data.map((item) => {
        if(item.status == "PENDENTE" && item.total_amount != "NaN" ){
          pedding += Number(item.total_amount)
        }
      })
      //const paid = formatCurrencyCompact(data.total_paid)
      //const pedding = formatCurrencyCompact(data.total_pedding)
      let total = (paid + pedding)
      setTotalBilled(totalSales)
      setTotalPaid(formatCurrencyCompact(paid))
      setTotalPedding(formatCurrencyCompact(pedding))
      setEstimated(formatCurrencyCompact(total))
      
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const fetchChartData = async (period: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/invoices/chart?period=${period}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar gráfico");
    }

    const data = await response.json();

    setChartData(
      data.map((item: any) => ({
        name: item.name,
        sales: Number(item.sales)
      }))
    );

  } catch (error) {
    console.error(error);
    setChartData([]);
  }
};
  
  
  const kpis = [
    { label: 'Baixo Estoque', value: qntLow, change: 'Atenção', color: 'amber', icon: <AlertTriangle className="size-5" /> },
    { label: 'Esgotados', value: qntEmpty, change: 'Crítico', color: 'rose', icon: <XCircle className="size-5" /> },
    { label: 'Valor em Estoque', value: valueStock, change: '', color: 'emerald', icon: <Package className="size-5" /> },
    { label: 'Total Faturado', value: totalPaid, change: '', color: 'primary', icon: <DollarSign className="size-5" /> },
    { label: 'Total Pendência', value: totalPedding, change: '', color: 'primary', icon: <BarChart3 className="size-5" /> },
    { label: 'Total de Vendas', value: totalBilled, change: '', color: 'primary', icon: <ShoppingCart className="size-5" /> },
    { label: 'Venda Total', value: estimated, change: '', color: 'primary', icon: <TrendingUp className="size-5" /> },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
      case 'rose': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
      default: return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' };
    }
  };

  useEffect(() => {
    fetchProducts()
    getInvoiceSummary()

  }, [])

  useEffect(() => {
    fetchChartData(timeFilter);
  }, [timeFilter])


  return (
    <div className="flex min-h-screen bg-background-dark text-slate-200">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">

        <div className="p-8 space-y-8">
          {/* KPI Grid - Row 1 (Stock Indicators - 3 items) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpis.slice(0, 3).map((kpi, idx) => {
              const colors = getColorClasses(kpi.color || 'primary');
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="bg-surface-dark p-5 rounded-2xl border border-border-dark shadow-xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform`}>
                      {kpi.icon}
                    </div>
                  
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{kpi.label}</p>
                  <h3 className="text-xl font-black mt-1 tracking-tight text-white group-hover:text-primary transition-colors">{kpi.value}</h3>
                </motion.div>
              );
            })}
          </section>

          {/* KPI Grid - Row 2 (Financial Indicators - 4 items) */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.slice(3).map((kpi, idx) => {
              const colors = getColorClasses(kpi.color || 'primary');
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 3) * 0.05 }}
                  key={idx + 3} 
                  className="bg-surface-dark p-5 rounded-2xl border border-border-dark shadow-xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform`}>
                      {kpi.icon}
                    </div>
    
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{kpi.label}</p>
                  <h3 className="text-xl font-black mt-1 tracking-tight text-white group-hover:text-primary transition-colors">{kpi.value}</h3>
                </motion.div>
              );
            })}
          </section>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl shadow-xl flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                  <h4 className="text-white font-black uppercase tracking-tight text-lg">Tendência de Vendas</h4>
                  <p className="text-xs text-slate-500 font-medium italic">Valor de vendas consolidado por período</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 bg-background-dark p-1 rounded-xl border border-border-dark">
                  {[
                    { label: '30 Dias', value: '30d' },
                    { label: '3 Meses', value: '3m' },
                    { label: '6 Meses', value: '6m' },
                    { label: '1 Ano', value: '1y' },
                    { label: '2 Anos', value: '2y' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setTimeFilter(filter.value as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                        timeFilter === filter.value 
                          ? 'bg-primary text-background-dark shadow-lg' 
                          : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffd900" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ffd900" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d2d" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#141414', border: '1px solid #2d2d2d', borderRadius: '12px', fontSize: '12px'}}
                      itemStyle={{color: '#ffd900', fontWeight: 'bold'}}
                      cursor={{ stroke: '#ffd900', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ffd900" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;