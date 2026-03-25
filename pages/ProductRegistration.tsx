
import React, { useEffect, useRef, useState } from 'react';
import fotoPadrao from '../assets/padrao.jpeg';
import { MOCK_PRODUCTS } from '../constants';
import { baseUrl } from "../services/AuthService"

const ProductRegistration: React.FC = () => {

  const topRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const itemsPerPage = 20;
  const [editingProduct, setEditingProduct] = useState(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const base = baseUrl
  const initialProduct = {
    id: "",
    product_name: "",
    barcode: "",
    sale_price: "",
    price_cost: "",
    stock: "",
    unit: "UN",
    sku:"", 
    mark:"", 
    image: "", 
    minStock: "", 
    discount: ""
  };
  const [product, setProduct] = useState(initialProduct)

  function clearFields() {
    if(editingProduct){
      setEditingProduct(null)
      setProduct(initialProduct);
    }else{
      setProduct(initialProduct);
    }
  }

  useEffect(() => {
      fetchProducts();
    }, []);

    useEffect(() => {
      
      calcPriceCost();
    }, [product.sale_price]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${base}/product`);

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) =>
        a.product_name.localeCompare(b.product_name, "pt-BR", { sensitivity: "base" })
      );
      setProducts(sortedData); 
      
    } catch (error) {
      console.error(error);
    }
  };

  function parseMoney(value: string | number) {
    if (typeof value === "number") return value;

    // Se já estiver no formato decimal com ponto
    if (value.includes(".") && !value.includes(",")) {
      return parseFloat(value);
    }

    // Se estiver no formato brasileiro 1.234,56
    const normalized = value
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(normalized);
  }



  function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const productToSend = {
      ...product,
      sale_price: parseMoney(product.sale_price),
      price_cost: parseMoney(product.price_cost),
    };
    productToSend;
    formData.append("product_name", product.product_name || "");
    formData.append("barcode", product.barcode || "");
    formData.append("sale_price", String(productToSend.sale_price || 0));
    formData.append("price_cost", String(productToSend.price_cost || 0));
    formData.append("stock", String(product.stock || 0));
    formData.append("unit", product.unit || "UN");
    formData.append("mark", product.mark || "");
    formData.append("sku", product.sku || "");
    formData.append("discount", product.discount || "10");
    formData.append("minStock", String(product.minStock || 0));
    

    if (image) {
      formData.append("image", image);
    }
    try{
      if (editingProduct) {
        // editar
        await fetch(`${base}/product/${product.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // criar
        await fetch(`${base}/product`, {
          method: "POST",
          body: formData,
        });
      }

      setEditingProduct(null);
      setProduct(initialProduct);
      fetchProducts();
      setImagePreview(null)
      setPreview(null)

      await fetchProducts();

      // ✅ 🔥 AQUI entra o toast
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);

    } catch (error){
      console.error(error)
    }
  };

  function calcPriceCost() {
    const sale = parseMoney(product.sale_price);

    if (!sale || sale <= 0) return;

    const cost = sale - (sale * 0.375);

    setProduct(prev => ({
      ...prev,
      price_cost: cost.toFixed(2) // mantém 2 casas decimais
    }));
  }
  
  const handleEdit = (prod: any) => {
    setEditingProduct(prod)
    setProduct(prod);

    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    
    await fetch(`${base}/product/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  const filteredProducts = products.filter((prod: any) =>
    prod.product_name.toLowerCase().includes(search.toLowerCase()) ||
    prod.barcode?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(file);
      setPreview(URL.createObjectURL(file)); // cria preview temporário
    }
  };

  
  return (
    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-8 duration-500" ref={topRef}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-dark pb-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Cadastro de Produtos</h2>
          <p className="text-slate-500 mt-2 font-medium">Gerencie o inventário de varejo e novos cadastros corporativos.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={clearFields} className="px-6 py-3 text-xs font-black uppercase tracking-widest border border-border-dark rounded-xl hover:bg-white/5 transition-all">
          {editingProduct ? 'Cancelar Edição' : 'Limpar'} </button>
          <button  onClick= {(e) => {handleSubmit(e)}} className="px-8 py-3 text-xs font-black uppercase tracking-widest bg-primary text-background-dark rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-lg">save</span>
            {editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-dark p-8 rounded-2xl border border-border-dark shadow-2xl">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
              <span className="material-symbols-outlined text-primary">info</span>
              Informações Gerais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Nome do Produto</label>
                <input value={product.product_name}
                  onChange={(e) =>
                    setProduct({ ...product, product_name: e.target.value.toUpperCase() })
                    } className="w-full bg-background-dark border-border-dark rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder:text-slate-700 font-bold" placeholder="Ex: Caixa monofásica" type="text"/>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Marca</label>
                <input value={product.mark}
                  onChange={(e) =>
                    setProduct({ ...product, mark: e.target.value.toUpperCase() })
                    } className="w-full bg-background-dark border-border-dark rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white font-mono font-bold" placeholder="Krona" type="text"/>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Código SKU</label>
                <input value={product.sku}
                  onChange={(e) =>
                    setProduct({ ...product, sku: e.target.value })
                    } className="w-full bg-background-dark border-border-dark rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white font-mono font-bold" placeholder="SKU-00000" type="text"/>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">EAN (Código de Barras)</label>
                <div className="relative">
                  <input value={product.barcode}
                  onChange={(e) =>
                    setProduct({ ...product, barcode: e.target.value })
                    } className="w-full bg-background-dark border-border-dark rounded-xl pl-5 pr-12 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white font-mono font-bold" placeholder="7890000000000" type="text"/>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">barcode_scanner</span>
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Unidade</label>
                <select onChange={(e) => {
                    const value = e.target.value;
                    const text = e.target.options[e.target.selectedIndex].text;
                    setProduct({ ...product, unit: text })
                  }} 
                  className="w-full bg-background-dark border-border-dark rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white appearance-none font-bold">
                  <option>UN</option>
                  <option>KG</option>
                </select>
              </div>
              <div className="md:col-span-1 group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Estoque</label>
                <input value={product.stock}
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                    } className="w-full bg-background-dark border-border-dark rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder:text-slate-700 font-bold" placeholder="Ex: 0" type="text"/>
              </div>
              <div className="md:col-span-1 group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Estoque Mínimo</label>
                <input value={product.minStock}
                  onChange={(e) =>
                    setProduct({ ...product, minStock: e.target.value })
                    } className="w-full bg-background-dark border-border-dark rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white placeholder:text-slate-700 font-bold" placeholder="Ex: 0" type="text"/>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark p-8 rounded-2xl border border-border-dark shadow-2xl">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
              <span className="material-symbols-outlined text-primary">payments</span>
              Precificação e Custos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Preço de Venda</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm uppercase">R$</span>
                  <input value={product.sale_price}
                  onChange={(e) =>
                    setProduct({ ...product, sale_price: e.target.value })
                    }className="w-full bg-background-dark border-border-dark rounded-xl pl-12 pr-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white font-bold" placeholder="0,00" type="number"/>
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Preço de Custo</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm uppercase">R$</span>
                  <input value={product.price_cost}
                  onChange={(e) =>
                    setProduct({ ...product, price_cost: e.target.value })
                    } className="w-full bg-background-dark border-border-dark rounded-xl pl-12 pr-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white font-bold" placeholder="0,00" type="number"/>
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2.5 text-slate-500 group-focus-within:text-primary transition-colors">Desconto Máximo</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm uppercase">%</span>
                  <input value={product.discount}
                  onChange={(e) =>
                    setProduct({ ...product, discount: e.target.value })
                    } className="w-full bg-background-dark border-border-dark rounded-xl pl-12 pr-5 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-white font-bold" placeholder="0.00" type="number"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 h-full flex flex-col">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-surface-dark p-8 rounded-2xl border border-border-dark shadow-2xl flex flex-col flex-1 cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {setImage(e.target.files?.[0] || null), handleImageChange(e || null)}}
            />

            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
              <span className="material-symbols-outlined text-primary">image</span>
              Mídia do Produto
            </h3>

            <div className="flex-1 border-2 border-dashed border-border-dark rounded-2xl flex flex-col items-center justify-center p-10 text-center hover:border-primary/50 transition-all bg-black/20">

              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 object-contain rounded-xl"
                />
              ) : (
                <>
                  <div className="size-20 bg-background-dark rounded-full flex items-center justify-center mb-6 border border-border-dark group-hover:border-primary/50 group-hover:scale-110 transition-all shadow-xl">
                    <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-primary">
                      upload_file
                    </span>
                  </div>

                  <p className="text-sm font-black text-white uppercase tracking-tighter">
                    Clique para enviar imagem
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    ou arraste o arquivo aqui
                  </p>
                  <p className="text-[10px] text-slate-600 mt-6 uppercase tracking-[0.2em] font-black">
                    PNG, JPG até 5MB
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 p-5 bg-primary/5 border border-primary/10 rounded-xl shadow-inner">
              <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">
                "As imagens devem ter fundo branco preferencialmente para o catálogo digital do{" "}
                <span className="text-primary font-black uppercase">
                  Liderança Construções
                </span>."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Produtos Existentes</h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input value={search}
                      onChange={(e) => 
                        {setSearch(e.target.value);
                        setCurrentPage(1)}}
                      className="bg-surface-dark border-border-dark rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary w-80 outline-none transition-all text-white font-bold placeholder:text-slate-700" placeholder="Buscar por nome ou Código..." type="text"/>
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg group-focus-within:text-primary transition-colors">search</span>
            </div>
            <button className="p-3 border border-border-dark rounded-xl hover:bg-white/5 text-slate-400 hover:text-primary transition-all shadow-lg">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
          </div>
        </div>
        <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Produto</th>
                  <th className="px-8 py-5">SKU</th>
                  <th className="px-8 py-5">Marca</th>
                  <th className="px-8 py-5">Preço</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {currentProducts
                    .map((prod: any) => (
                      <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-background-dark border border-border-dark overflow-hidden group-hover:border-primary/50 transition-colors">
                              <img src={prod.image ? `${base}${prod.image}` : fotoPadrao}
                                alt={prod.product_name} className="size-full object-contain p-1"
                                onError={(e) => {
                                    e.currentTarget.onerror = null; 
                                    e.currentTarget.src = fotoPadrao;
                                  }}
                                />
                            </div>
                            <span className="text-sm font-black text-white uppercase group-hover:text-primary transition-colors">{prod.product_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-mono font-bold text-slate-500">{prod.sku}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1.5 bg-background-dark border border-border-dark rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {prod.mark}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-white">R$ {formatMoney(Number(prod.sale_price))}</td>
                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Ativo
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button onClick={() => handleEdit(prod)} className="p-2 text-slate-500 hover:text-primary transition-colors bg-background-dark rounded-lg border border-border-dark">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button onClick={() => handleDelete(prod.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors bg-background-dark rounded-lg border border-border-dark">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-5 bg-black/20 border-t border-border-dark flex items-center justify-between">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Exibindo {indexOfFirst + 1} - {Math.min(indexOfLast, filteredProducts.length)} de {filteredProducts.length} produtos</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)} 
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-dark hover:bg-white/5 transition-all text-slate-500">Anterior</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary text-background-dark rounded-lg">{currentPage}</button>
              <button disabled={indexOfLast >= filteredProducts.length}
                onClick={() => setCurrentPage(currentPage + 1)} 
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-dark hover:bg-white/5 transition-all text-slate-500">Próximo</button>
            </div>
          </div>
        </div>
      </section>

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

export default ProductRegistration;
