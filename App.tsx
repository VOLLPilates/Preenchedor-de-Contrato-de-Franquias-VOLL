
import React, { useState } from 'react';
import { Download, FileText, CheckCircle, PenTool, User, Wallet, Scale, Eye, ArrowLeft, Plus, Trash2, Edit2, MapPin, ChevronRight, Calendar } from 'lucide-react';
import { ContractData, initialData, Witness, RoyaltyOption } from './types';
import ContractTemplate from './components/ContractTemplate';

declare global {
  interface Window {
    html2pdf: any;
  }
}

// --- Helper Functions ---

const isValidCPF = (cpf: string): boolean => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let cpfArray = cpf.split('').map(el => +el);
  let rest = (count: number) => (cpfArray.slice(0, count-12)
      .reduce((soma, el, index) => (soma + el * (count-index)), 0)*10) % 11 % 10;
  return rest(10) === cpfArray[9] && rest(11) === cpfArray[10];
};

const maskCurrency = (value: string): string => {
  let v = value.replace(/\D/g, "");
  v = (Number(v) / 100).toFixed(2) + "";
  v = v.replace(".", ",");
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return "R$ " + v;
};

const estadosCivis = [
  "Solteiro(a)",
  "Casado(a)",
  "Divorciado(a)",
  "Viúvo(a)",
  "Separado(a) judicialmente",
  "União Estável"
];

const App: React.FC = () => {
  const [data, setData] = useState<ContractData>(initialData);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'investment' | 'royalties' | 'signatures'>('personal');
  const [showPreview, setShowPreview] = useState(false);
  
  // Validation States
  const [cpfError, setCpfError] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  // Royalty Editing State
  const [editingRoyalty, setEditingRoyalty] = useState<RoyaltyOption | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const numeric = value.replace(/\D/g, '');
      let masked = numeric;
      if (numeric.length <= 11) {
        masked = numeric
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
      }
      setData(prev => ({ ...prev, [name]: masked }));
      if (numeric.length === 11) {
        setCpfError(!isValidCPF(numeric));
      } else {
        // Only clear error if empty or incomplete, strict validation happens on 11 chars
        setCpfError(false); 
      }
      return;
    }

    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!value || value.trim() === 'R$' || value.trim() === 'R$') {
       setData(prev => ({ ...prev, [name]: '' }));
       return;
    }

    const formatted = maskCurrency(value);
    setData(prev => ({ ...prev, [name]: formatted }));
  };

  const handleCepBlur = async () => {
    const cep = data.enderecoCep.replace(/\D/g, '');
    if (cep.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const result = await response.json();
        if (!result.erro) {
          setData(prev => ({
            ...prev,
            enderecoRua: result.logradouro || '',
            enderecoBairro: result.bairro || '',
            enderecoCidadeUF: `${result.localidade}/${result.uf}`
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const addWitness = () => {
    const newWit: Witness = { id: Date.now().toString(), cpf: '', rg: '' };
    setData(prev => ({ ...prev, testemunhas: [...prev.testemunhas, newWit] }));
  };

  const removeWitness = (id: string) => {
    setData(prev => ({ ...prev, testemunhas: prev.testemunhas.filter(w => w.id !== id) }));
  };

  const updateWitness = (id: string, field: 'cpf' | 'rg', value: string) => {
    setData(prev => ({
      ...prev,
      testemunhas: prev.testemunhas.map(w => w.id === id ? { ...w, [field]: value } : w)
    }));
  };

  const addRoyalty = () => {
    const newOpt: RoyaltyOption = { 
      id: Date.now().toString(), 
      title: 'Nova Opção de Royalties', 
      description: 'Descrição da nova opção.', 
      value: '0' 
    };
    setData(prev => ({ 
      ...prev, 
      royaltiesOptions: [...prev.royaltiesOptions, newOpt],
      selectedRoyaltyId: newOpt.id
    }));
    setEditingRoyalty(newOpt);
  };

  const removeRoyalty = (id: string) => {
    const newOptions = data.royaltiesOptions.filter(r => r.id !== id);
    setData(prev => ({ 
      ...prev, 
      royaltiesOptions: newOptions,
      selectedRoyaltyId: prev.selectedRoyaltyId === id ? (newOptions[0]?.id || '') : prev.selectedRoyaltyId
    }));
  };

  const saveEditingRoyalty = () => {
    if (editingRoyalty) {
      setData(prev => ({
        ...prev,
        royaltiesOptions: prev.royaltiesOptions.map(r => r.id === editingRoyalty.id ? editingRoyalty : r)
      }));
      setEditingRoyalty(null);
    }
  };

  const handleTestFill = () => {
    setData({
      ...initialData,
      nome: "AQUI VAI O NOME COMPLETO",
      nacionalidadeType: "Brasileira",
      estadoCivil: "Casado(a)",
      profissao: "AQUI VAI A PROFISSÃO",
      rg: "1234567890",
      cpf: "000.000.000-00",
      enderecoRua: "AQUI VAI O ENDEREÇO (RUA)",
      enderecoNumero: "123",
      enderecoComplemento: "Apto 101",
      enderecoBairro: "Centro",
      enderecoCidadeUF: "Porto Alegre/RS",
      enderecoCep: "90000-000",
      
      valorKit: "R$ 56.890,00",
      valorEquipamentos: "R$ 21.990,00",
      valorEntradaEquip: "R$ 1.832,50",
      dataEquipamentos: "2025-10-30", // ISO for date input
      numeroParcelasEquip: "11",
      valorParcelaEquip: "R$ 1.832,50",
      
      valorFranqueadora: "R$ 34.900,00",
      valorEntradaFranq: "R$ 2.908,33",
      dataFranqueadora: "2025-10-28", // ISO for date input
      numeroParcelasFranq: "11",
      valorParcelaFranq: "R$ 2.908,33",
      taxaFranquia: "R$ 15.000,00",

      selectedRoyaltyId: data.royaltiesOptions[0]?.id || '',
      royaltiesOptions: initialData.royaltiesOptions,

      cidadeAssinatura: "Porto Alegre",
      dataAssinatura: new Date().toISOString().split('T')[0],
      testemunhas: [
        { id: '1', cpf: '000.000.000-00', rg: '123456' },
        { id: '2', cpf: '111.111.111-11', rg: '654321' }
      ]
    });
  };

  const generatePDF = () => {
    // Validation check before generation
    if (data.nacionalidadeType === 'Brasileira') {
      const numericCPF = data.cpf.replace(/[^\d]+/g, '');
      if (!isValidCPF(numericCPF)) {
        alert("O CPF informado é inválido. Por favor, corrija antes de baixar o documento.");
        setCpfError(true);
        setActiveTab('personal'); // Redirect to personal tab
        return;
      }
    }

    setGenerating(true);
    const element = document.getElementById('contract-content');
    
    if (!element) {
        setGenerating(false);
        return;
    }

    const opt = {
      margin: 0, 
      filename: `Contrato_Franquia_${data.nome || 'Novo'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, 
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const needsUnhide = !showPreview;
    if (needsUnhide) {
      element.classList.remove('hidden');
    }

    window.html2pdf().set(opt).from(element).save().then(() => {
        if (needsUnhide) {
          element.classList.add('hidden');
        }
        setGenerating(false);
    });
  };

  const tabs = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'investment', label: 'Investimento', icon: Wallet },
    { id: 'royalties', label: 'Royalties', icon: Scale },
    { id: 'signatures', label: 'Assinaturas', icon: PenTool },
  ];

  // Increased contrast classes
  const inputClass = "w-full rounded-lg border border-slate-300 bg-white text-slate-900 shadow-sm focus:ring-2 focus:ring-[#00AAA1] focus:border-[#00AAA1] focus:outline-none transition-all duration-200 p-3 placeholder:text-slate-400";
  const errorInputClass = "w-full rounded-lg border border-red-300 bg-red-50 text-slate-900 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-200 p-3 placeholder:text-red-300";
  const labelClass = "block text-sm font-semibold text-slate-800 mb-1.5 ml-1";

  if (showPreview) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-800 text-slate-100 font-sans">
        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 sticky top-0 z-20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setShowPreview(false)}
                 className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-md hover:bg-slate-800"
               >
                 <ArrowLeft className="w-5 h-5" />
                 Voltar
               </button>
               <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
               <h1 className="text-lg font-semibold text-white hidden sm:block">Visualização do Contrato</h1>
             </div>
             <button
               onClick={generatePDF}
               disabled={generating}
               className="flex items-center gap-2 bg-[#00AAA1] hover:bg-[#008f88] text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#00AAA1]/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
             >
               {generating ? 'Gerando...' : 'Baixar PDF / DOC'}
               <Download className="w-4 h-4" />
             </button>
           </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-800/50">
           <ContractTemplate data={data} id="contract-content" mode="preview" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-[#00AAA1]/10 rounded-lg">
                <FileText className="w-6 h-6 text-[#00AAA1]" />
             </div>
             <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight hidden sm:block">Contrato Franquias VOLL</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Preenchimento automático</p>
                <h1 className="text-lg font-bold text-slate-900 block sm:hidden">Contrato VOLL</h1>
             </div>
           </div>
           <div className="flex gap-3">
             <button 
               onClick={handleTestFill}
               className="hidden sm:block text-sm text-slate-500 hover:text-[#00AAA1] font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
             >
               Preencher Teste
             </button>
             <button
               onClick={() => setShowPreview(true)}
               className="flex items-center gap-2 text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm sm:text-base"
             >
               <Eye className="w-4 h-4" />
               <span className="hidden sm:inline">Visualizar</span>
             </button>
             <button
               onClick={generatePDF}
               disabled={generating}
               className="flex items-center gap-2 bg-[#00AAA1] hover:bg-[#008f88] text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md shadow-[#00AAA1]/20 active:scale-95 disabled:opacity-50 text-sm sm:text-base"
             >
               <span className="hidden sm:inline">{generating ? 'Gerando...' : 'Baixar PDF'}</span>
               <span className="inline sm:hidden">PDF</span>
               <Download className="w-4 h-4" />
             </button>
           </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0 grid grid-cols-2 lg:flex lg:flex-col gap-2 lg:sticky lg:top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-[#00AAA1] shadow-md shadow-slate-200 border border-slate-100' 
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-900 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#00AAA1]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#00AAA1]" />}
                </button>
              );
            })}
          </nav>

          {/* Form Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-white p-6 sm:p-10 transition-all">
            
            {activeTab === 'personal' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Dados do Franqueado</h2>
                    <p className="text-slate-500 mt-1">Informe os dados pessoais para o preâmbulo do contrato.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className={labelClass}>Nome Completo</label>
                    <input type="text" name="nome" value={data.nome} onChange={handleChange} className={inputClass} placeholder="Ex: Maria da Silva" />
                  </div>
                  
                  {/* Nationality */}
                  <div className="col-span-2 md:col-span-1">
                    <label className={labelClass}>Nacionalidade</label>
                    <div className="flex gap-4 mb-3 p-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${data.nacionalidadeType === 'Brasileira' ? 'border-[#00AAA1]' : 'border-slate-300'}`}>
                             {data.nacionalidadeType === 'Brasileira' && <div className="w-2.5 h-2.5 bg-[#00AAA1] rounded-full" />}
                          </div>
                          <input 
                            type="radio" 
                            name="nacionalidadeType" 
                            checked={data.nacionalidadeType === 'Brasileira'} 
                            onChange={() => setData(d => ({ ...d, nacionalidadeType: 'Brasileira' }))}
                            className="hidden"
                          />
                          <span className="text-slate-700 group-hover:text-slate-900">Brasileira</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${data.nacionalidadeType === 'Outra' ? 'border-[#00AAA1]' : 'border-slate-300'}`}>
                             {data.nacionalidadeType === 'Outra' && <div className="w-2.5 h-2.5 bg-[#00AAA1] rounded-full" />}
                          </div>
                          <input 
                            type="radio" 
                            name="nacionalidadeType" 
                            checked={data.nacionalidadeType === 'Outra'} 
                            onChange={() => setData(d => ({ ...d, nacionalidadeType: 'Outra' }))}
                            className="hidden"
                          />
                          <span className="text-slate-700 group-hover:text-slate-900">Outra</span>
                        </label>
                    </div>
                    {data.nacionalidadeType === 'Outra' && (
                      <input 
                        type="text" 
                        name="nacionalidadeCustom" 
                        value={data.nacionalidadeCustom} 
                        onChange={handleChange} 
                        className={inputClass} 
                        placeholder="Digite a nacionalidade (Ex: Portuguesa)" 
                        autoFocus
                      />
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className={labelClass}>Estado Civil</label>
                    <div className="relative">
                      <select name="estadoCivil" value={data.estadoCivil} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="">Selecione...</option>
                        {estadosCivis.map(ec => (
                          <option key={ec} value={ec}>{ec}</option>
                        ))}
                      </select>
                      <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-4 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-2">
                    <label className={labelClass}>Profissão</label>
                    <input type="text" name="profissao" value={data.profissao} onChange={handleChange} className={inputClass} placeholder="Ex: Fisioterapeuta" />
                  </div>
                  
                  <div>
                    <label className={labelClass}>CPF {data.nacionalidadeType !== 'Brasileira' && <span className="text-xs font-normal text-slate-500">(Opcional para estrangeiros)</span>}</label>
                    <input 
                      type="text" 
                      name="cpf" 
                      value={data.cpf} 
                      onChange={handleChange} 
                      className={cpfError ? errorInputClass : inputClass} 
                      placeholder="Ex: 000.000.000-00" 
                      maxLength={14}
                    />
                    {cpfError && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span> CPF Inválido</p>}
                  </div>
                  
                  <div>
                    <label className={labelClass}>RG</label>
                    <input type="text" name="rg" value={data.rg} onChange={handleChange} className={inputClass} placeholder="Ex: 00.000.000-0" />
                  </div>
                  
                  <div className="col-span-2 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-[#00AAA1]" />
                        <h3 className="text-lg font-bold text-slate-800">Endereço</h3>
                    </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                     <label className={labelClass}>CEP <span className="text-slate-400 font-normal text-xs ml-1">(Busca Automática)</span></label>
                     <div className="relative">
                       <input 
                          type="text" 
                          name="enderecoCep" 
                          value={data.enderecoCep} 
                          onChange={handleChange} 
                          onBlur={handleCepBlur}
                          className={inputClass} 
                          placeholder="00000-000"
                        />
                        {cepLoading && (
                          <div className="absolute right-3 top-3.5 animate-spin h-5 w-5 border-2 border-[#00AAA1] rounded-full border-t-transparent"></div>
                        )}
                     </div>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                     <label className={labelClass}>Cidade/UF</label>
                     <input type="text" name="enderecoCidadeUF" value={data.enderecoCidadeUF} onChange={handleChange} className={inputClass} placeholder="Ex: Porto Alegre/RS" />
                  </div>

                  <div className="col-span-2">
                     <label className={labelClass}>Rua/Logradouro</label>
                     <input type="text" name="enderecoRua" value={data.enderecoRua} onChange={handleChange} className={inputClass} />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                     <label className={labelClass}>Número</label>
                     <input type="text" name="enderecoNumero" value={data.enderecoNumero} onChange={handleChange} className={inputClass} />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                     <label className={labelClass}>Complemento</label>
                     <input type="text" name="enderecoComplemento" value={data.enderecoComplemento} onChange={handleChange} className={inputClass} placeholder="Ex: Apto 101, Bloco B" />
                  </div>
                  
                  <div className="col-span-2">
                     <label className={labelClass}>Bairro</label>
                     <input type="text" name="enderecoBairro" value={data.enderecoBairro} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'investment' && (
              <div className="space-y-8 animate-fadeIn">
                 <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Investimento e Taxas</h2>
                    <p className="text-slate-500 mt-1">Valores referentes à Cláusula 11 do contrato.</p>
                 </div>
                 
                 <div className="bg-gradient-to-br from-[#e6f7f6] to-[#d0f0ee] p-6 rounded-xl border border-[#b3e6e3] shadow-sm">
                    <label className="block text-sm font-bold text-[#006661] mb-2 uppercase tracking-wide">Valor Total do KIT (Equipamentos e Serviços)</label>
                    <input type="text" name="valorKit" value={data.valorKit} onChange={handleMoneyChange} className="w-full rounded-lg border-0 bg-white/80 backdrop-blur-sm text-[#004d49] shadow-inner focus:ring-2 focus:ring-[#00AAA1] focus:bg-white focus:outline-none p-4 font-bold text-2xl placeholder:text-[#004d49]/30" placeholder="R$ 0,00" />
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Factory Section */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                            <div className="w-2 h-8 bg-slate-400 rounded-full"></div>
                            <h3 className="font-bold text-slate-800 text-lg">Pagamento à Fábrica</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Valor Total Fábrica</label>
                                <input type="text" name="valorEquipamentos" value={data.valorEquipamentos} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                            </div>
                            <div>
                                <label className={labelClass}>Valor Entrada (Pix)</label>
                                <input type="text" name="valorEntradaEquip" value={data.valorEntradaEquip} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                            </div>
                            <div>
                                <label className={labelClass}>Data Limite Entrada</label>
                                <div className="relative">
                                    <input type="date" name="dataEquipamentos" value={data.dataEquipamentos} onChange={handleChange} className={inputClass} />
                                    <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="w-1/3">
                                <label className={labelClass}>Qtd. Parcelas</label>
                                <div className="relative">
                                   <input type="text" name="numeroParcelasEquip" value={data.numeroParcelasEquip} onChange={handleChange} className={`${inputClass} text-center`} />
                                   <span className="absolute right-3 top-3.5 text-slate-400 text-sm font-medium">x</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                 <label className={labelClass}>Valor da Parcela (Boleto)</label>
                                 <input type="text" name="valorParcelaEquip" value={data.valorParcelaEquip} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                              </div>
                            </div>
                        </div>
                    </div>

                    {/* Franchisor Section */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                             <div className="w-2 h-8 bg-[#00AAA1] rounded-full"></div>
                            <h3 className="font-bold text-slate-800 text-lg">Pagamento à Franqueadora</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Valor Total Franqueadora</label>
                                <input type="text" name="valorFranqueadora" value={data.valorFranqueadora} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                            </div>
                            <div>
                                <label className={labelClass}>Valor Entrada (Pix)</label>
                                <input type="text" name="valorEntradaFranq" value={data.valorEntradaFranq} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                            </div>
                            <div>
                                <label className={labelClass}>Data Limite Entrada</label>
                                <div className="relative">
                                    <input type="date" name="dataFranqueadora" value={data.dataFranqueadora} onChange={handleChange} className={inputClass} />
                                    <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="w-1/3">
                                <label className={labelClass}>Qtd. Parcelas</label>
                                <div className="relative">
                                   <input type="text" name="numeroParcelasFranq" value={data.numeroParcelasFranq} onChange={handleChange} className={`${inputClass} text-center`} />
                                   <span className="absolute right-3 top-3.5 text-slate-400 text-sm font-medium">x</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                 <label className={labelClass}>Valor da Parcela (Boleto)</label>
                                 <input type="text" name="valorParcelaFranq" value={data.valorParcelaFranq} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                              </div>
                            </div>
                        </div>
                    </div>
                 </div>

                 <div className="pt-6 mt-6 border-t border-slate-100">
                    <label className={labelClass}>Taxa de Franquia (Isenta)</label>
                    <div className="max-w-xs">
                        <input type="text" name="taxaFranquia" value={data.taxaFranquia} onChange={handleMoneyChange} className={inputClass} placeholder="R$ 0,00" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 ml-1">Valor mencionado na cláusula 11.2.2</p>
                 </div>
              </div>
            )}

            {activeTab === 'royalties' && (
               <div className="space-y-8 animate-fadeIn">
                 <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Opções de Royalties</h2>
                    <p className="text-slate-500 mt-1">Gerencie e selecione a opção de royalties para o contrato.</p>
                 </div>
                 
                 {/* Modal/Overlay for Editing */}
                 {editingRoyalty && (
                   <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all scale-100">
                       <h3 className="text-xl font-bold mb-6 text-slate-900">Editar Opção</h3>
                       <div className="space-y-5">
                         <div>
                            <label className={labelClass}>Título</label>
                            <input 
                              className={inputClass} 
                              value={editingRoyalty.title} 
                              onChange={(e) => setEditingRoyalty({...editingRoyalty, title: e.target.value})}
                              placeholder="Ex: Opção 1..."
                            />
                         </div>
                         <div>
                            <label className={labelClass}>Descrição</label>
                            <textarea 
                              className={inputClass} 
                              rows={4}
                              value={editingRoyalty.description} 
                              onChange={(e) => setEditingRoyalty({...editingRoyalty, description: e.target.value})}
                              placeholder="Detalhes da cobrança..."
                            />
                         </div>
                       </div>
                       <div className="mt-8 flex justify-end gap-3">
                         <button onClick={() => setEditingRoyalty(null)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                         <button onClick={saveEditingRoyalty} className="px-5 py-2.5 bg-[#00AAA1] text-white rounded-lg hover:bg-[#008f88] font-medium shadow-lg shadow-[#00AAA1]/20 transition-all">Salvar Alterações</button>
                       </div>
                     </div>
                   </div>
                 )}

                 <div className="grid gap-4">
                    {data.royaltiesOptions.map((option) => {
                      const isSelected = data.selectedRoyaltyId === option.id;
                      return (
                        <div 
                          key={option.id} 
                          className={`group relative p-5 border-2 rounded-xl transition-all duration-300 ${
                            isSelected 
                              ? 'border-[#00AAA1] bg-[#e6f7f6]/50 shadow-md' 
                              : 'border-slate-100 bg-white hover:border-[#00AAA1]/30 hover:shadow-sm'
                          }`}
                        >
                           <div className="flex items-start gap-4">
                              <div 
                                 onClick={() => setData(d => ({ ...d, selectedRoyaltyId: option.id }))}
                                 className={`mt-1 cursor-pointer flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                   isSelected ? 'border-[#00AAA1] bg-white' : 'border-slate-300 bg-slate-50 group-hover:border-[#00AAA1]/50'
                                 }`}
                              >
                                 {isSelected && <div className="w-3 h-3 bg-[#00AAA1] rounded-full" />}
                              </div>
                              
                              <div className="flex-1 cursor-pointer pt-0.5" onClick={() => setData(d => ({ ...d, selectedRoyaltyId: option.id }))}>
                                 <p className={`font-bold text-lg ${isSelected ? 'text-[#00AAA1]' : 'text-slate-800'}`}>{option.title}</p>
                                 <p className="text-sm text-slate-600 mt-2 leading-relaxed">{option.description}</p>
                              </div>

                              <div className="flex gap-1">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingRoyalty(option); }} 
                                  className="p-2 text-slate-400 hover:text-[#00AAA1] hover:bg-[#00AAA1]/10 rounded-lg transition-colors" 
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); removeRoyalty(option.id); }} 
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                  title="Remover"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                    
                    <button 
                      onClick={addRoyalty} 
                      className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-[#00AAA1] hover:text-[#00AAA1] hover:bg-[#00AAA1]/5 flex items-center justify-center gap-2 font-medium transition-all"
                    >
                      <Plus className="w-5 h-5" /> Adicionar Nova Opção
                    </button>
                 </div>
               </div>
            )}

            {activeTab === 'signatures' && (
               <div className="space-y-8 animate-fadeIn">
                 <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Assinaturas</h2>
                    <p className="text-slate-500 mt-1">Dados finais para validação do documento.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Cidade da Assinatura</label>
                        <input type="text" name="cidadeAssinatura" value={data.cidadeAssinatura} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Data da Assinatura</label>
                        <div className="relative">
                            <input type="date" name="dataAssinatura" value={data.dataAssinatura} onChange={handleChange} className={inputClass} />
                            <Calendar className="w-5 h-5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                 </div>

                 <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-100">
                   <div className="flex items-center justify-between mb-6">
                     <div>
                       <h3 className="font-bold text-slate-800 text-lg">Testemunhas</h3>
                       <p className="text-slate-500 text-sm">Adicione as testemunhas que assinarão o contrato.</p>
                     </div>
                     <button onClick={addWitness} className="px-4 py-2 bg-white border border-slate-200 text-[#00AAA1] rounded-lg text-sm font-medium hover:bg-[#e6f7f6] hover:border-[#00AAA1]/30 transition-colors flex items-center gap-2 shadow-sm">
                       <Plus className="w-4 h-4" /> Adicionar
                     </button>
                   </div>
                   
                   <div className="space-y-4">
                     {data.testemunhas.length === 0 && (
                        <p className="text-center text-slate-400 py-4 italic">Nenhuma testemunha adicionada.</p>
                     )}
                     {data.testemunhas.map((wit, index) => (
                       <div key={wit.id} className="p-5 bg-white rounded-lg border border-slate-200 relative group hover:shadow-md transition-shadow">
                          <button 
                            onClick={() => removeWitness(wit.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
                            title="Remover testemunha"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">{index + 1}</span>
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Testemunha</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className={labelClass}>CPF</label>
                                <input 
                                  type="text" 
                                  value={wit.cpf} 
                                  onChange={(e) => updateWitness(wit.id, 'cpf', e.target.value)} 
                                  className={inputClass}
                                  placeholder="000.000.000-00" 
                                />
                             </div>
                             <div>
                                <label className={labelClass}>RG</label>
                                <input 
                                  type="text" 
                                  value={wit.rg} 
                                  onChange={(e) => updateWitness(wit.id, 'rg', e.target.value)} 
                                  className={inputClass} 
                                />
                             </div>
                          </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            )}
            
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
               <div className="text-sm text-slate-400 hidden sm:block">
                 Passo {tabs.findIndex(t => t.id === activeTab) + 1} de {tabs.length}
               </div>
               <div className="flex gap-3 ml-auto">
                 {activeTab !== 'signatures' ? (
                   <button 
                     onClick={() => {
                       const currentIndex = tabs.findIndex(t => t.id === activeTab);
                       if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1].id as any);
                       }
                     }}
                     className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                   >
                     Próximo
                     <ChevronRight className="w-4 h-4" />
                   </button>
                 ) : (
                   <>
                    <button
                       onClick={() => setShowPreview(true)}
                       className="flex items-center gap-2 text-slate-700 bg-white hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors border border-slate-200 shadow-sm"
                    >
                      <Eye className="w-5 h-5" />
                      Visualizar
                    </button>
                     <button 
                        onClick={generatePDF}
                        disabled={generating}
                        className="flex items-center gap-2 bg-[#00AAA1] hover:bg-[#008f88] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-[#00AAA1]/30 active:scale-95 disabled:opacity-50"
                     >
                       {generating ? 'Gerando...' : 'Finalizar Contrato'}
                       <CheckCircle className="w-5 h-5" />
                     </button>
                   </>
                 )}
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Hidden Contract Template for PDF Generation */}
      {!showPreview && <ContractTemplate data={data} id="contract-content" mode="hidden" />}
    </div>
  );
};

export default App;
