
export interface Witness {
  id: string;
  cpf: string;
  rg: string;
}

export interface RoyaltyOption {
  id: string;
  title: string; // e.g., "Opção 1: R$ 990,00..."
  description: string; // e.g., "O valor de royalties..."
  value: string; // Short value for selection logic if needed, or just use ID
}

export interface ContractData {
  // Preamble - Personal Info
  nome: string;
  nacionalidadeType: 'Brasileira' | 'Outra';
  nacionalidadeCustom: string;
  estadoCivil: string;
  profissao: string;
  rg: string;
  cpf: string;
  enderecoRua: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  enderecoBairro: string;
  enderecoCidadeUF: string;
  enderecoCep: string;

  // Clause 11 - Investment
  valorKit: string; 
  valorEquipamentos: string; 
  valorEntradaEquip: string; 
  dataEquipamentos: string; 
  numeroParcelasEquip: string; 
  valorParcelaEquip: string; 
  
  valorFranqueadora: string; 
  valorEntradaFranq: string; 
  dataFranqueadora: string; 
  numeroParcelasFranq: string; 
  valorParcelaFranq: string; 
  
  taxaFranquia: string; 

  // Clause 11.9 - Royalties Selection
  royaltiesOptions: RoyaltyOption[];
  selectedRoyaltyId: string;

  // Signatures
  cidadeAssinatura: string;
  dataAssinatura: string;
  
  testemunhas: Witness[];
}

export const initialData: ContractData = {
  nome: "",
  nacionalidadeType: "Brasileira",
  nacionalidadeCustom: "",
  estadoCivil: "", // Default empty to force selection
  profissao: "",
  rg: "",
  cpf: "",
  enderecoRua: "",
  enderecoNumero: "",
  enderecoComplemento: "",
  enderecoBairro: "",
  enderecoCidadeUF: "",
  enderecoCep: "",
  
  // Cleaned defaults (user requested to start without fixed values)
  valorKit: "",
  valorEquipamentos: "",
  valorEntradaEquip: "",
  dataEquipamentos: "",
  numeroParcelasEquip: "",
  valorParcelaEquip: "",
  
  valorFranqueadora: "",
  valorEntradaFranq: "",
  dataFranqueadora: "",
  numeroParcelasFranq: "",
  valorParcelaFranq: "",
  
  taxaFranquia: "", // Empty to allow user input

  royaltiesOptions: [
    {
      id: '990',
      title: 'Opção 1: R$ 990,00 (novecentos e noventa reais) ao mês.',
      description: 'O valor de royalties começará a ser cobrado no mês subsequente a realização da inauguração, e assim consequentemente nos meses posteriores. (Com recebimento de Cursos VOLL)',
      value: '990'
    },
    {
      id: '1490',
      title: 'Opção 2: R$ 1.490,00 (um mil quatrocentos e noventa reais) ao mês.',
      description: 'O valor de royalties começará a ser cobrado no mês subsequente a realização da inauguração, e assim consequentemente nos meses posteriores. (Sem recebimento de Cursos VOLL)',
      value: '1490'
    },
    {
      id: 'isencao',
      title: 'Opção 3: Isenção de Royalties.',
      description: 'Conforme condições de não recebimento de cursos descritas na cláusula 11.8.',
      value: '0'
    }
  ],
  selectedRoyaltyId: '990',

  cidadeAssinatura: "",
  // Use ISO format for date picker compatibility
  dataAssinatura: new Date().toISOString().split('T')[0],
  
  testemunhas: [
    { id: '1', cpf: '', rg: '' },
    { id: '2', cpf: '', rg: '' }
  ]
};
