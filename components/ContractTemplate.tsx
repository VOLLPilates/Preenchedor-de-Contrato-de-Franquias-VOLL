
import React from 'react';
import { ContractData } from '../types';

interface Props {
  data: ContractData;
  id: string;
  mode?: 'hidden' | 'preview';
}

const ContractTemplate: React.FC<Props> = ({ data, id, mode = 'hidden' }) => {
  
  const getNacionalidade = () => {
    return data.nacionalidadeType === 'Brasileira' ? 'Brasileira' : data.nacionalidadeCustom;
  };

  const getSelectedRoyalty = () => {
    const selected = data.royaltiesOptions.find(r => r.id === data.selectedRoyaltyId);
    if (!selected) return <span>Opção não selecionada</span>;
    
    return (
      <span>
        <strong>{selected.title}</strong><br/>
        {selected.description}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "___/___/____";
    try {
      // Expecting YYYY-MM-DD from date input
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
      return dateString; // Fallback if already formatted
    } catch (e) {
      return dateString;
    }
  };

  const formatDateFull = (dateString: string) => {
      if (!dateString) return "___ de ______________ de ______";
      try {
          const [year, month, day] = dateString.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const monthName = date.toLocaleString('pt-BR', { month: 'long' });
          return `${day} DE ${monthName.toUpperCase()} DE ${year}`;
      } catch (e) {
          return dateString;
      }
  };

  // Determine styling based on mode
  const containerClass = mode === 'preview' 
    ? "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] mx-auto text-black my-8 print-container-preview transform transition-all duration-500 ease-in-out" 
    : "hidden"; // Hidden for PDF generation (default)
  
  const wrapperStyle = mode === 'preview' ? { maxWidth: '210mm', minHeight: '297mm' } : {};

  return (
    <div id={id} className={containerClass} style={wrapperStyle}>
      {/* Container that simulates A4 paper for html2pdf */}
      <div className="print-container">
        
        {/* Page 1 Cover */}
        <div className="flex flex-col justify-between h-[1000px] text-center mb-0">
           <div className="mt-40">
             <h1 className="text-2xl font-bold uppercase">CONTRATO DE FRANQUIA VOLL PILATES STUDIOS</h1>
             <h2 className="text-xl font-bold uppercase mt-4">MODALIDADE STUDIO PRO</h2>
           </div>
           <p className="mb-10 text-right w-full pr-10">2</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 2 Preamble */}
        <div>
          <p className="text-right mb-10">3</p>
          <h1 className="text-center font-bold uppercase mb-2">CONTRATO DE FRANQUIA VOLL PILATES STUDIOS</h1>
          <h2 className="text-center font-bold uppercase mb-8">MODALIDADE STUDIO PRO</h2>

          <p>
            Pelo presente instrumento particular e na melhor forma do direito, de um lado <strong>WOLF GESTÃO DE ATIVOS LTDA – VOLL PILATES STUDIOS</strong>, pessoa jurídica de direito privado, com sede na cidade de Porto Alegre, na Avenida Diário de Notícias, 200, sala 706, Porto Alegre, RS, devidamente inscrita no CNPJ sob o número 33.489.631/0001-75, neste ato representado pelo sócio Diretor <strong>HENRIQUE TONETO WOLF</strong>, brasileiro, divorciado, educador físico, portador do RG 3071458156 inscrito no CPF Nº 80577687034, residente e domiciliado em Porto Alegre-RS, doravante denominada <strong>FRANQUEADORA</strong> e <strong>{data.nome.toUpperCase()}</strong>, {getNacionalidade()}, {data.estadoCivil}, {data.profissao}, portadora do RG Nº {data.rg} inscrita no CPF Nº {data.cpf}, residente e domiciliada na Rua {data.enderecoRua}, n° {data.enderecoNumero}, {data.enderecoComplemento ? `${data.enderecoComplemento}, ` : ''}bairro {data.enderecoBairro}, {data.enderecoCidadeUF}, CEP: {data.enderecoCep} denominada simplesmente <strong>FRANQUEADA</strong>, têm entre si justo e acordado o presente <strong>CONTRATO DE FRANQUIA VOLL PILATES STUDIOS</strong>.
          </p>

          <p className="font-bold mt-6 mb-2">Considerações iniciais:</p>
          
          <ol className="list-[upper-roman] pl-8 space-y-4">
            <li>A <strong>FRANQUEADORA</strong> desenvolveu um modelo de negócio voltado a implementação e gestão de Studios de Pilates, denominado <strong>VOLL PILATES STUDIOS</strong>, que atende o público com serviços de aulas de atividades físicas, dentre elas, o Método Pilates, Treinamento Funcional, Método Abdominal Hipopressivo e Treinamento Suspenso;</li>
            <li>A <strong>FRANQUEADORA</strong> disponibilizará seu know-how ao <strong>FRANQUEADO</strong> por meio de treinamentos e capacitações, sejam elas presenciais, escritos ou on-line.</li>
            <li>A MARCA VOLL PILATES STUDIOS foi depositada e deferida perante o Instituto Nacional de Propriedade Industrial e teve seu pedido de registro sob o nº <strong>916.707.512</strong> na classe <strong>NCL 11 (35)</strong> e será concedida ao <strong>FRANQUEADO</strong> em caráter não exclusivo, no território compreendido neste Contrato de Franquia celebrado entre as partes.</li>
            <li>A <strong>FRANQUEADORA</strong> é detentora dos direitos de uso da marca VOLL PILATES STUDIOS, conforme registro <strong>916707512 constante no INPI</strong> e documento esse anexo a COF;</li>
            <li>O <strong>FRANQUEADO</strong> tem interesse em operar uma FRANQUIA VOLL PILATES STUDIOS mediante adoção de todo o modelo de negócio oferecido e se compromete a seguir na integralidade os manuais e orientações da <strong>FRANQUEADORA</strong>;</li>
            <li>O <strong>FRANQUEADO</strong> está ciente que a <strong>FRANQUEADORA</strong> não efetua a cobrança de Fundo Nacional de Marketing;</li>
          </ol>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 3 */}
        <div>
           <p className="text-right mb-10">4</p>
           <ol className="list-[upper-roman] pl-8 space-y-4" start={7}>
            <li>O <strong>FRANQUEADO</strong> declara expressamente não ter recebido da <strong>FRANQUEADORA</strong> qualquer garantia de lucro;</li>
            <li>A <strong>FRANQUEADORA</strong> disponibilizou, através da COF - CIRCULAR DE OFERTA DE FRANQUIA, todos os esclarecimentos e informações sobre o negócio VOLL PILATES STUDIOS;</li>
            <li>O <strong>FRANQUEADO</strong> recebeu a COF - CIRCULAR DE OFERTA DE FRANQUIA, há mais de 10 (dez) dias, tendo estudado e concordado com todas as informações, dados, cláusulas e condições constantes nos referidos documentos e tendo dirimido suas dúvidas;</li>
            <li>A <strong>FRANQUEADORA</strong> em nenhum momento fez qualquer tipo de promessa e garantia quanto a resultados ou rentabilidade do negócio;</li>
            <li>Não há negócio sem risco. Ainda que se considere toda a estrutura e operação do sistema de franquias, não há por parte da <strong>FRANQUEADORA</strong>, qualquer promessa de resultado.</li>
            <li><strong>DA NÃO OBRIGATORIEDADE DO SEGURO</strong> - A <strong>FRANQUEADORA</strong> não exige como obrigatório que o <strong>FRANQUEADO</strong> realize seguro do local e da sua atividade, contudo, em decorrência do negócio, sugere que o <strong>FRANQUEADO</strong> realize o seguro dependendo das variações de local e do número de alunos existentes.</li>
            <li>A <strong>FRANQUEADORA</strong> durante a vigência do contrato de franquia realizará a supervisão da rede, ou seja, poderá fazer visitas nas unidades, com o intuito de auxiliar no desempenho e na melhoria do negócio.</li>
            <li>A Taxa de Franquia de R$15.000,00 foi ISENTA ao franqueado.</li>
           </ol>

           <p className="mt-6">Assim, cientes e sabedoras de suas responsabilidades e direitos, as partes resolvem espontaneamente celebrar o presente <strong>CONTRATO DE FRANQUIA</strong>, nas seguintes condições dispostas nas páginas seguintes:</p>

           <h3 className="font-bold mt-6">1. OBJETO</h3>
           <p className="pl-4">1.1. O OBJETO do presente CONTRATO é a concessão, pela <strong>FRANQUEADORA</strong> ao <strong>FRANQUEADO</strong>, o direito exclusivo, pessoal e intransferível, de utilizar fielmente o modelo de negócio VOLL PILATES STUDIOS, com as técnicas e <em>KNOW-HOW</em> específicos da MARCA, bem como toda a padronização e sinais distintivos contidos nos manuais e demais materiais de orientação.</p>

           <h3 className="font-bold mt-6">2. DIREITO PERSONALÍSSIMO, SOLIDARIEDADE E INDEPENDÊNCIA DAS PARTES</h3>
           <p className="pl-4">2.1. O presente CONTRATO tem caráter personalíssimo, sendo firmado em Intuito Personae, sendo o <strong>FRANQUEADO</strong> responsável por concluir o treinamento inicial promovido pela <strong>FRANQUEADORA</strong>, bem como gerir ou administrar a sua UNIDADE, nos termos desse CONTRATO, devendo, necessariamente, ter participação no capital social e poderes de administrador da empresa que irá operar a UNIDADE.</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 4 */}
        <div>
          <p className="text-right mb-10">5</p>
          <p className="pl-4">2.2. A UNIDADE deverá ser implantada em <strong>até 180 dias</strong> a partir da assinatura deste instrumento ou em <strong>até 03 meses</strong>, após o envio de todos os equipamentos, mediante a constituição de empresa própria, pessoa jurídica da qual o <strong>FRANQUEADO</strong> detenha capital social superior a 50% e poderes de administrador, sendo referida empresa juridicamente autônoma da <strong>FRANQUEADORA</strong>, vedando-se completamente a utilização do nome VOLL PILATES STUDIOS ou palavras similares, gráfica ou foneticamente, à MARCA, na criação da denominação social da pessoa jurídica do <strong>FRANQUEADO</strong>.</p>
          <p className="pl-4 mt-2">2.3. A UNIDADE será operada por pessoa jurídica diversa e independente da <strong>FRANQUEADORA</strong>, a ser constituída exclusivamente para esse fim, proibindo-se a inclusão de atividades estranhas a esse CONTRATO no objeto social.</p>
          <p className="pl-4 mt-2">2.4. Em nenhum momento a <strong>FRANQUEADORA</strong> poderá ser responsabilizada por qualquer débito ou infração legal de responsabilidade da UNIDADE perante FORNECEDORES, COLABORADORES, governo ou terceiros.</p>
          <p className="pl-4 mt-2">2.5. A <strong>EMPRESA FRANQUEADA</strong> deverá fazer cumprir todas as regras trabalhistas, contratuais e de conselhos de classe em que estiver inserta, registrando e mantendo atualizados os documentos de seus COLABORADORES, honrando pontualmente com as obrigações trabalhistas, previdenciárias e fiscais.</p>
          <p className="pl-4 mt-2">2.6. Havendo qualquer tipo de processo administrativo, judicial ou extrajudicial, arbitral ou de qualquer tipo, relativamente à atividade do <strong>FRANQUEADO</strong> e/ou da <strong>EMPRESA FRANQUEADA</strong>, junto ao PROCON, órgãos de proteção ao consumidor, bem como qualquer órgão no âmbito federal, estadual ou municipal, fica ajustado que a responsabilidade será exclusiva do <strong>FRANQUEADO</strong> e da <strong>EMPRESA FRANQUEADA</strong>, quanto à solução da lide e contratação de profissionais para esse fim. Em hipótese alguma haverá vínculo de natureza trabalhista ou previdenciária, ou de qualquer subordinação entre os COLABORADORES da <strong>FRANQUEADORA</strong> e do <strong>FRANQUEADO</strong> ou da <strong>EMPRESA FRANQUEADA</strong>.</p>
          <p className="pl-4 mt-2">2.7. Caso a <strong>FRANQUEADORA</strong> seja demandada por qualquer FORNECEDOR, ou CLIENTE, ou por qualquer pessoa ligada ao <strong>FRANQUEADO</strong> ou a <strong>EMPRESA FRANQUEADA</strong>, é dever do <strong>FRANQUEADO</strong> ou à <strong>EMPRESA FRANQUEADA</strong> ingressar nos autos e requerer imediatamente a exclusão da <strong>FRANQUEADORA</strong> do polo passivo, arcando ainda com todo o dano que venha a causar à <strong>FRANQUEADORA</strong>, nos termos da legislação civil em vigor.</p>

          <h3 className="font-bold mt-6">3. PRAZO DE CONTRATO E CONDIÇÃO DE RENOVAÇÃO</h3>
          <p className="pl-4">3.1. O presente CONTRATO terá o prazo de <strong>vigência de 05 (cinco) anos</strong>, a contar da data de sua assinatura.</p>
          <p className="pl-4">3.2. Ao final do contrato, o mesmo poderá ser renovado por igual período, sem cobrança de taxa de renovação de franquia.</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 5 */}
        <div>
          <p className="text-right mb-10">6</p>
          <ol className="list-[upper-roman] pl-12">
            <li>Contudo, para que ocorra a renovação do Contrato de Franquia o <strong>FRANQUEADO</strong> deverá estar adimplente em relação aos royalties e eventuais débitos, bem como cumprindo as demais regras descritas no contrato.</li>
          </ol>

          <h3 className="font-bold mt-6">4. TERRITÓRIO</h3>
          <p className="pl-4">4.1. A <strong>FRANQUEADORA</strong> faz a concessão, tratada na cláusula 1ª acima, à <strong>FRANQUEADA</strong>, durante o prazo deste contrato, concedendo exclusividade de atuação no território assim determinado.</p>
          <ol className="list-[upper-roman] pl-12 mt-2">
            <li>É de responsabilidade do <strong>FRANQUEADO</strong>, conhecedor da região onde pretende instalar uma UNIDADE VOLL PILATES STUDIOS, realizar a escolha do PONTO COMERCIAL. A <strong>FRANQUEADORA</strong> fornecerá as premissas para a escolha adequada do ponto de acordo com o seu conhecimento do negócio e mercado, entretanto, a decisão final é do <strong>FRANQUEADO</strong>.</li>
          </ol>
          <p className="pl-4 mt-2">4.2. A atuação da UNIDADE VOLL PILATES STUDIOS será permitida exclusivamente no endereço da UNIDADE, não sendo autorizada a realização de serviços ou venda fora do estabelecimento. Não é permitido ao <strong>FRANQUEADO</strong> alterar o nome ou endereço de sua UNIDADE, sem a prévia e expressa anuência da <strong>FRANQUEADORA</strong>, mediante adendo contratual.</p>
          <p className="pl-4 mt-2">4.3. Em cidades com <strong>até 30 mil habitantes</strong> o <strong>FRANQUEADO</strong> terá exclusividade de atuação da cidade.</p>
          <p className="pl-4 mt-2">4.4. Nas cidades com população superior a 30 mil habitantes deverá ser respeitado uma distância <strong>mínima de 1km</strong> de cada UNIDADE existente.</p>
          <ol className="list-[upper-roman] pl-12 mt-2">
            <li>A <strong>FRANQUEADORA</strong> poderá AUMENTAR a distância mínima quando o estudo de geolocalização indicar a necessidade de espaçamento maior entre as UNIDADES.</li>
          </ol>
          <p className="pl-4 mt-2">4.5. Em caso de rescisão do contrato de franquia ou ao seu término sem renovação, o <strong>FRANQUEADO</strong> obriga-se a não explorar direta ou indiretamente, por si ou por intermédio de terceiros, a prestação de serviços de Pilates no mesmo ponto comercial em que está instalada a <strong>UNIDADE FRANQUEADA VOLL</strong> para não incorrer em concorrência desleal.</p>
          <p className="pl-4 mt-2">4.6. <strong>Assim que aprovado o território, a FRANQUEADA deverá informar para a FRANQUEADORA o LOCAL e solicitar a assinatura de um aditivo Contratual a fim de resguardar direitos territoriais. Além disso, sugere-se, também, que a FRANQUEADA abra sua empresa por meio de inscrição de CNPJ e também informe e solicite o aditivo competente.</strong></p>

          <h3 className="font-bold mt-6">5. SERVIÇOS E PRODUTOS</h3>
          <p className="pl-4">5.1. O ROL DE SERVIÇOS já previamente autorizados e disponíveis para utilização do <strong>FRANQUEADO</strong> na UNIDADE serão descritos a seguir: Pilates; Mat Pilates; Pilates em Grupo; MAH (Método Abdominal Hipopressivo); VOLL Suspension (Pilates e Funcional em Suspensão) e Treinamento Funcional.</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 6 */}
        <div>
          <p className="text-right mb-10">7</p>
          <p className="pl-4">5.2. A <strong>FRANQUEADORA</strong> poderá incluir novos serviços e produtos dentro do ROL de serviços e permitirá ao <strong>FRANQUEADO</strong> que inclua em sua UNIDADE.</p>
          <p className="pl-4 mt-2">5.3. As atividades a seguir já estão previamente liberadas pela <strong>FRANQUEADORA</strong> para o <strong>FRANQUEADO</strong> incluir em sua unidade, se assim desejar: Treinamento Funcional, musculação, estética e dermato-funcional, clínica médica e fisioterapia, nutrição e psicologia.</p>
          <p className="pl-4 mt-2">5.4. Qualquer outra atividade ligada a área de fisioterapia, educação física, nutrição e similares, que não esteja elencada no item acima, somente poderá ser explorada na UNIDADE mediante autorização expressa da <strong>FRANQUEADORA</strong>, devendo ser feito requerimento por e-mail.</p>

          <h3 className="font-bold mt-6">6. IMPLANTAÇÃO DA UNIDADE E PADRÕES ARQUITETÔNICOS</h3>
          <p className="pl-4">6.1. A UNIDADE deverá ser implantada e operada com zelo e profissionalismo, seguindo as orientações da <strong>FRANQUEADORA</strong> por meio de manuais ou vídeo-manuais, orientação da equipe da <strong>FRANQUEADORA</strong> ou plataforma do <strong>FRANQUEADO</strong>, obedecendo as diretrizes para instalação e gerenciamento de uma UNIDADE VOLL PILATES STUDIOS.</p>
          <p className="pl-4 mt-2">6.2. <strong>Responsabilidade pelos Projetos e Execução da Obra</strong> - A <strong>FRANQUEADORA</strong> disponibiliza aos FRANQUEADOS a possibilidade de contratar profissionais e empresas parceiros da marca, previamente homologados, para o desenvolvimento de projetos arquitetônicos e de interiores das unidades VOLL PILATES STUDIOS. <strong>O projeto arquitetônico já está incluído no pagamento do kit inicial.</strong></p>
          <p className="pl-8 mt-2">6.2.1. Os projetos arquitetônicos são elaborados por profissionais autônomos e independentes, devidamente habilitados e cadastrados junto ao Conselho de Arquitetura e Urbanismo (CAU), cuja responsabilidade técnica e legal restringe-se à concepção e ao desenvolvimento do projeto, conforme padrões visuais e operacionais estabelecidos pela <strong>FRANQUEADORA</strong>.</p>
          <p className="pl-8 mt-2">6.2.2. Os projetos elaborados, pela arquiteta homologada, serão entregues em formato digital, por meio eletrônico, contendo todas as informações necessárias à sua correta compreensão e execução.</p>
          <p className="pl-8 mt-2">6.2.3. A arquiteta homologada se compromete a prestar suporte técnico à distância para o esclarecimento de eventuais dúvidas relativas ao entendimento do projeto, sem que tal suporte implique em acompanhamento de obra ou responsabilidade sobre sua execução.</p>
          <p className="pl-8 mt-2">6.2.4. O atendimento remoto da arquiteta homologada será limitado a orientações sobre o conteúdo do projeto, não incluindo visitas técnicas, compatibilização em campo, ajustes decorrentes de condições específicas do local, nem validação de soluções construtivas adotadas durante a execução.</p>
          <p className="pl-8 mt-2">6.2.5. A execução da obra, incluindo a contratação de mão de obra, fornecedores, aquisição de materiais, cumprimento de prazos, segurança, qualidade dos serviços e observância das normas técnicas, é de responsabilidade exclusiva do <strong>FRANQUEADO</strong> e/ou das empresas e profissionais por ele contratados, não cabendo à <strong>FRANQUEADORA</strong> nem aos arquitetos parceiros qualquer responsabilidade solidária ou subsidiária por eventuais vícios, falhas construtivas, atrasos, acidentes, danos materiais ou pessoais decorrentes da execução.</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 7 */}
        <div>
          <p className="text-right mb-10">8</p>
          <p className="pl-8">6.2.6 O suporte técnico prestado pelos arquitetos parceiros, quando houver, limita-se a esclarecimentos remotos sobre o conteúdo do projeto, não implicando acompanhamento de obra, validação de soluções construtivas ou responsabilidade sobre sua execução.</p>
          <p className="pl-8 mt-2">6.2.7 Qualquer serviço adicional, como acompanhamento presencial de obra, revisões, adequações ou compatibilizações, deverá ser objeto de contratação específica e independente entre o franqueado e o profissional responsável, sem qualquer intermediação, ingerência ou solidariedade da <strong>FRANQUEADORA</strong>.</p>
          <p className="pl-8 mt-2">6.2.8 A <strong>FRANQUEADORA</strong> atua, portanto, exclusivamente como intermediadora da indicação técnica e não assume obrigações, garantias ou riscos decorrentes de contratos firmados diretamente entre o <strong>FRANQUEADO</strong> e os profissionais indicados.</p>

          <h3 className="font-bold mt-6">7. DIREITOS E DEVERES DO FRANQUEADO</h3>
          <p className="pl-4">7.1. Com a assinatura do presente CONTRATO, o <strong>FRANQUEADO</strong> terá direito a:</p>
          <p className="pl-12">7.1.2 Receber ou acessar os Manuais da Franquia, com os procedimentos de administração e operação da <strong>UNIDADE FRANQUEADA</strong>;</p>
          <p className="pl-12 mt-1">7.1.3 Utilizar a marca para todas as atividades inerentes à franquia, durante a vigência do contrato;</p>
          <p className="pl-12 mt-1">7.1.4 Receber treinamento para administração e operação de sua <strong>UNIDADE FRANQUEADA</strong>;</p>
          <p className="pl-12 mt-1">7.1.5 Receber apoio e orientação da <strong>FRANQUEADORA</strong>;</p>
          <p className="pl-12 mt-1">7.1.6 Realizar cursos e capacitações do Grupo VOLL com 50% de desconto;</p>
          <p className="pl-12 mt-1">7.1.7 Receber acesso a Plataforma do <strong>FRANQUEADO</strong>.</p>
          <p className="pl-12 mt-1">7.1.8 Receber um projeto arquitetônico, desenvolvido por arquiteta homologada;</p>

          <p className="pl-4 mt-4">7.2 São deveres do <strong>FRANQUEADO</strong>:</p>
          <p className="pl-12">7.2.2 Aplicar em sua UNIDADE os conhecimentos repassados pela <strong>FRANQUEADORA</strong>, por meio de treinamentos e manuais, seguindo sempre suas orientações;</p>
          <p className="pl-12 mt-1">7.2.3 Manter absoluto sigilo em relação a toda e qualquer informação ou especificação contida em treinamentos e/ou manuais que venha a receber;</p>
          <p className="pl-12 mt-1">7.2.4 Não explorar atividade que, direta ou indiretamente, seja considerada concorrente ao ramo de atividade objeto da franquia concedida, durante a vigência do CONTRATO;</p>
          <p className="pl-12 mt-1">7.2.5 Fornecer documentos e prestar informações detalhadas e com clareza sobre o desempenho da <strong>UNIDADE FRANQUEADA</strong>, sempre que solicitado, em prazo máximo de 48 horas;</p>
          <p className="pl-12 mt-1">7.2.6 Utilizar, preencher e manter atualizado diariamente o Sistema de Gestão do seu Studio;</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 8 */}
        <div>
          <p className="text-right mb-10">9</p>
          <p className="pl-12">7.2.7 Caso o <strong>FRANQUEADO</strong> opte em RECEBER cursos da <strong>FRANQUEADORA</strong> aos finais de semana, deverá ceder o espaço de sua UNIDADE à <strong>FRANQUEADORA</strong> ou ao Grupo VOLL PILATES para a realização de cursos de capacitação por ela fornecidos;</p>
          <p className="pl-12 mt-1">7.2.8 Efetuar investimentos em marketing local, visando a divulgação da marca e serviços da UNIDADE, de acordo com as orientações da <strong>FRANQUEADORA</strong>;</p>
          <p className="pl-12 mt-1">7.2.9 Informar a <strong>FRANQUEADORA</strong> sobre todas as suas ações de pré-inauguração, bem como o dia da Inauguração da sua UNIDADE.</p>

          <h3 className="font-bold mt-6">8. FORNECEDORES</h3>
          <p className="pl-4">8.1. Ao <strong>FRANQUEADO</strong> é obrigatório adquirir produtos ou serviços exclusivamente dos FORNECEDORES homologados pela <strong>FRANQUEADORA</strong> para que se mantenha o padrão de qualidade da rede. (A garantia dos produtos comprados com fornecedores é de responsabilidade dos próprios fabricantes)</p>
          <p className="pl-4 mt-2">8.2. O <strong>FRANQUEADO</strong> poderá realizar a aquisição de produto ou serviço não-homologado, caso não haja fornecedor homologado específico para determinado produto ou serviço, cuja aquisição seja necessária ao bom funcionamento da UNIDADE.</p>

          <h3 className="font-bold mt-6">9. DIREITOS E DEVERES DA FRANQUEADORA</h3>
          <p className="pl-4">9.2 São direitos da <strong>FRANQUEADORA</strong>:</p>
          <p className="pl-12">9.2.1 A possibilidade de retirar acessos, materiais e o suporte ao <strong>FRANQUEADO</strong>, caso o mesmo não esteja adimplente com os valores dos ROYALTIES;</p>
          <p className="pl-12 mt-1">9.2.2 Inspecionar as instalações do <strong>FRANQUEADO</strong> sempre que desejar, sem aviso prévio e tendo irrestrito acesso às dependências;</p>
          <p className="pl-12 mt-1">9.2.3 Quando o <strong>FRANQUEADO</strong> optar em RECEBER cursos da <strong>FRANQUEADORA</strong>, poderá utilizar o espaço da <strong>UNIDADE FRANQUEADA</strong> para ministração dos cursos ligados ao Grupo VOLL PILATES;</p>
          <ul className="list-disc pl-20">
             <li>Neste caso, o uso da UNIDADE será somente aos finais de semana;</li>
             <li>A VOLL PILATES irá avisar com pelo menos 30 (trinta) dias de antecedência quando desejar fazer uso da UNIDADE;</li>
             <li>O <strong>FRANQUEADO</strong> recebe 100% de abatimento no valor dos Royalties daquele mês sempre que receber o curso do Grupo VOLL PILATES na sua UNIDADE.</li>
             <li>O <strong>FRANQUEADO</strong> deixará seu Studio disponível por 60 dias após o término do curso para que os ALUNOS que realizaram o Curso de Pilates realizem estágio Observatório, agendado no Studio de acordo com a disponibilidade do <strong>FRANQUEADO</strong>.</li>
          </ul>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 9 */}
        <div>
           <p className="text-right mb-10">10</p>
           <p className="pl-4">9.3 São deveres da <strong>FRANQUEADORA</strong>:</p>
           <p className="pl-12">9.3.1 Fornecer os Manuais da Franquia, explicar os procedimentos de montagem, administração e operação da <strong>UNIDADE FRANQUEADA</strong> ou outros, em conformidade com o que está definido na Circular de Oferta de Franquia;</p>
           <p className="pl-12 mt-1">9.3.2 Prestar auxílio na implantação e manutenção da <strong>UNIDADE FRANQUEADA</strong>, desde a seleção de ponto comercial, layout, projetos, instalações físicas, treinamento de pessoal, marketing e em outras atividades necessárias à implementação e operacionalização da empresa;</p>
           <p className="pl-12 mt-1">9.3.3 Disponibilizar materiais de marketing para uso do <strong>FRANQUEADO</strong>;</p>
           <p className="pl-12 mt-1">9.3.4 Orientar e dar apoio ao <strong>FRANQUEADO</strong>, sempre que o mesmo requisitar em horário comercial;</p>
           <p className="pl-12 mt-1">9.3.5 Prestar assistência para que a UNIDADE obtenha desempenho e resultados adequados à manutenção da empresa;</p>
           <p className="pl-12 mt-1">9.3.6 Disponibilizar acesso ao portal do <strong>FRANQUEADO</strong>;</p>
           <p className="pl-12 mt-1">9.3.7 Disponibilizar o site oficial da UNIDADE, bem como a Fanpage já configurada nos padrões VOLL PILATES STUDIOS.</p>
           <p className="pl-12 mt-1">9.3.8 Realizar apoio nos processos de abertura da franquia;</p>
           <p className="pl-12 mt-1">9.3.9 Realizar suporte comercial e de marketing de forma não presencial e com agendamento;</p>
           <p className="pl-12 mt-1">9.3.10 Análise e orientação acerca da escolha da instalação do ponto comercial.</p>

           <h3 className="font-bold mt-6">10. TRANSFERÊNCIA DA UNIDADE</h3>
           <p className="pl-4">10.1 Caso o <strong>FRANQUEADO</strong> pretenda vender sua UNIDADE a terceiros, deverá antes oferecer à <strong>FRANQUEADORA</strong> a UNIDADE.</p>
           <p className="pl-4 mt-2">10.2 Caso não se proceda a cessão da UNIDADE o próprio <strong>FRANQUEADO</strong>, deverá procurar o novo candidato a <strong>FRANQUEADO</strong>, que depois será avaliado para possível aprovação pela <strong>FRANQUEADORA</strong>.</p>
           <p className="pl-4 mt-2">10.3 Fica estipulado que, no caso de transferência da unidade franqueada a terceiros, será devida pelo Franqueado (cedente) à Franqueadora uma <strong>Taxa de Revenda no valor fixo de R$ 8.000,00 (oito mil reais)</strong>, a ser paga no ato da formalização da cessão dos direitos, independentemente de qualquer outra taxa administrativa ou contratual prevista. Este valor corresponde à remuneração da Franqueadora pelos serviços de análise, aprovação do novo franqueado (cessionário), suporte no processo de transição, e demais atividades relacionadas à cessão da unidade franqueada. A obrigatoriedade do pagamento desta taxa não exime o Franqueado da necessidade de obter <strong>anuência prévia e expressa da Franqueadora</strong> quanto ao cessionário, conforme já previsto nas cláusulas anteriores deste contrato.</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 10 */}
        <div>
          <p className="text-right mb-10">11</p>
          <h3 className="font-bold">11. INVESTIMENTO, RECEBIMENTOS E TAXAS</h3>
          <p className="pl-4">11.1. Deverá ser pago o valor de KIT de equipamentos e serviços:</p>

          <div className="border-2 border-[#00AAA1] p-4 my-4 font-bold text-center text-lg">
            {data.valorKit}
          </div>

          <p>Que será pago conforme a seguir:</p>
          
          <div className="border-2 border-[#00AAA1] p-4 my-4">
             <ul className="list-none space-y-4">
               <li>
                 <strong>➢ VALORES PAGOS DIRETAMENTE PARA A FÁBRICA DE EQUIPAMENTOS:</strong><br/>
                 <u>{data.valorEquipamentos}</u> a serem pagos da seguinte forma:
                 Entrada via pix no valor de {data.valorEntradaEquip} até o dia {formatDate(data.dataEquipamentos)} + {data.numeroParcelasEquip}x no boleto de {data.valorParcelaEquip} para empresa dos equipamentos.
               </li>
               <li>
                 <strong>➢ VALORES PAGOS DIRETAMENTE PARA A FRANQUEADORA:</strong><br/>
                 <u>{data.valorFranqueadora}</u> a serem pagos da seguinte forma:
                 : Entrada via pix no valor de {data.valorEntradaFranq} até o dia {formatDate(data.dataFranqueadora)} + {data.numeroParcelasFranq}x no boleto no valor de {data.valorParcelaFranq} com vencimento para todo dia 30 <strong>para a franqueadora</strong>.
               </li>
             </ul>
          </div>

          <p className="font-bold">Que restou pactuada da seguinte forma:</p>
          <p className="pl-4">11.2.1 As partes estabelecem que havendo atraso no pagamento, serão cobrados juros de mora na proporção de 1% (um por cento) ao mês pro rate die, multa moratória de 10% sobre o saldo devedor, cumulados esses a correção monetária pelo IGPM – Índice Geral de Preços do Mercado – da FGV, ou outro índice que o substituir, além das custas processuais e honorários advocatícios, caso ocorra a rescisão contratual por inadimplência e ação de execução judicial. Havendo inadimplência, poderão ser abatidos valores do recebimento de cursos da VOLL em seu respectivo studio, como comissão e pagamento referentes a indicação de cursos e prestação de serviços (caso o <strong>FRANQUEADO</strong> seja Treinador da VOLL).</p>
          <p className="pl-4 mt-2">11.2.2 A (TAF) Taxa de Aquisição de Franquia de <strong>{data.taxaFranquia}</strong> para esse contrato foi negociada e <strong><u>isentada</u></strong>, mas cabe esclarecer que tal valor é diferente dos valores de investimentos em equipamentos e de todo aquele chamado <strong>KIT INICIAL</strong> do <strong>FRANQUEADO</strong>.</p>
        </div>

        <div className="html2pdf__page-break"></div>

        {/* Page 11 */}
        <div>
          <p className="text-right mb-10">12</p>
          <p className="pl-4">11.2.3 Produtos que o <strong>FRANQUEADO</strong> recebe no <strong>KIT INICIAL</strong>:</p>
          <p className="pl-12">11.2.4 04 aparelhos principais: Cadillac, Reformer, Step Chair e Ladder Barrel da marca Equipilates;</p>
          <p className="pl-12 mt-1">11.2.5 01 caixa do Reformer; 01 Prancha de salto, 01 Plataforma de extensão</p>
          <p className="pl-12 mt-1">11.2.6 01 bola suíça de 65cm da marca LiveUp, Odin ou similar;</p>
          <p className="pl-12 mt-1">11.2.7 03 unidades de banda elástica, sendo uma na intensidade fraca, uma unidade na intensidade média e uma unidade na intensidade forte;</p>
          <p className="pl-12 mt-1">11.2.8 02 tonning balls de 1kg ou 2kg de acordo com a disponibilidade, da marca LiveUp, Odin ou similar</p>
          <p className="pl-12 mt-1">11.2.9 01 overball de 25cm da marca Acte, LiveUp ou similar;</p>
          <p className="pl-12 mt-1">11.2.10 2 latas de tinta de 3,6L na cor oficial VOLL PILATES STUDIOS da marca Coral, Suvinil ou similar;</p>
          <p className="pl-12 mt-1">11.2.11 01 Painel interno para a recepção do studio ou local similar com a Logo VOLL PILATES STUDIOS.</p>
          
          <p className="pl-4 mt-4">11.3 Na hipótese de rescisão contratual e/ou dissolução do negócio ora entabulado, os equipamentos, após a realização de todos os pagamentos dos valores de investimentos e royalties permanecerão com o <strong>FRANQUEADO</strong>.</p>
          <p className="pl-4 mt-2">11.4 O FRANQUEADO após assinar o Contrato de Franquia, <strong>terá um prazo de até 12 meses, contatos dessa assinatura, para solicitar a entrega dos equipamentos</strong>, sob pena, de pagar uma multa, no percentual de 2% incidente sobre o valor total dos equipamentos vigentes à época, bem como acrescidos das correções impostas pelos fornecedores;</p>
          <p className="pl-4 mt-2">11.5 O <strong>FRANQUEADO</strong> para solicitar os equipamentos, deverá ter adimplido <strong>70% do valor total descrito no item 11.1 (kit de equipamentos e serviços)</strong>, bem como já estar com local apropriado para recebê-los e com o contrato de compra ou locação devidamente firmados. Assim, após recebê-los, terá um prazo de até <strong>03 (três) meses</strong> para inaugurar o seu Studio <strong>FRANQUEADO, sob pena de iniciarem as cobranças dos royalties, independente da inauguração ocorrer.</strong></p>

          <p className="pl-4 mt-4">11.6 Serviços que o <strong>FRANQUEADO</strong> recebe:</p>
          <p className="pl-12">11.6.1 Página Internet da UNIDADE do <strong>FRANQUEADO</strong> dentro do site oficial "VOLLPILATES STUDIOS" - https://vollstudios.com.br/SUA_UNIDADE;</p>
          <p className="pl-12 mt-1">11.6.2 Acesso ao projeto arquitetônico padronizado da VOLL PILATES STUDIOS;</p>
          <p className="pl-12 mt-1">11.6.3 Acesso a Plataforma de Marketing e Treinamentos da VOLL PILATES STUDIOS;</p>
          <p className="pl-12 mt-1">11.6.4 Manual de Implantação do seu Studio;</p>
          <p className="pl-12 mt-1">11.6.5 Direito de ser representante de vendas VOLL PILATES GROUP, para revender cursos e produtos VOLL PILATES, através da plataforma de representante, recebendo comissão de 10% sobre cada venda de curso presencial VOLL e 25% sobre cada venda de curso online VOLL;</p>
        </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 12 */}
         <div>
            <p className="text-right mb-10">13</p>
            <p className="pl-12">11.6.6 Serviço de Geolocalização.</p>
            <p className="pl-4 mt-4">11.7 Curso Presencial que o <strong>FRANQUEADO</strong> recebe:</p>
            <p className="pl-12">11.7.1 Formação em Pilates pela Espaço Vida Pilates (Grupo VOLL) ou 1 Bolsa 100% a outro curso da VOLL PILATES caso já tenha a Formação em Pilates;</p>
            <p className="pl-12 mt-1">11.7.2 Dois cursos online:</p>
            <p className="pl-16">11.7.2.1 10 módulos do curso de avaliação;</p>
            <p className="pl-16">11.7.2.2 01 curso de Excelência em coluna.</p>

            <h3 className="font-bold mt-6">11.8 Royalties:</h3>
            <p className="pl-4">Royalties são cobrados no mês seguinte da Inauguração do Studio e são pagamentos mensais feitos pelo <strong>FRANQUEADO</strong> a <strong>FRANQUEADORA</strong>. Esses pagamentos garantem ao <strong>FRANQUEADO</strong> o uso contínuo da marca, produtos, serviços, treinamentos e suporte oferecidos. Os royalties garantem que o <strong>FRANQUEADO</strong> mantenha o acesso aos benefícios do sistema de franquia.</p>
            <p className="mt-4">Dentro da <strong>VOLL PILATES STUDIOS</strong> temos um sistema inovador de {data.royaltiesOptions.length} possibilidades de Royalties:</p>
            <ol className="list-decimal pl-12 mt-2 font-bold">
              {data.royaltiesOptions.map((opt) => (
                <li key={opt.id} className="mb-1">{opt.title.replace(/^Opção \d+: /, '')}</li>
              ))}
            </ol>
            <p className="mt-4">Abaixo, explicaremos como funciona o sistema inovador de Royalties da <strong>VOLL STUDIOS</strong>:</p>
            <p className="mt-2">O <strong>FRANQUEADO</strong> VOLL Studios tem a possibilidade de escolher se deseja ou não receber cursos da VOLL PILATES em seu Studio e esta escolha interfere diretamente no valor de Royalties.</p>
            
            <ul className="list-disc pl-8 mt-4 space-y-4">
              {data.royaltiesOptions.map((opt) => (
                <li key={opt.id}>
                  <strong>{opt.title}</strong><br/>
                  {opt.description}
                </li>
              ))}
            </ul>
         </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 13 */}
         <div>
            <p className="text-right mb-10">14</p>
            <p className="pl-4">Parágrafo Primeiro. O valor acima estipulado poderá sofrer, após o transcurso de 12 (doze) meses da inauguração da unidade, a atualização monetária anual pela variação positiva do IPCA (Índice Nacional de Preços ao Consumidor Amplo) ou do IGP-M (Índice Geral de Preços do Mercado), sempre prevalecendo, em favor da <strong>UNIDADE FRANQUEADA</strong>, o índice de menor valor entre os mencionados.</p>
            
            <p className="mt-6 font-bold">
               {data.royaltiesOptions.find(r => r.id === data.selectedRoyaltyId)?.title}
               <br />
               {data.royaltiesOptions.find(r => r.id === data.selectedRoyaltyId)?.description}
            </p>

            <h3 className="font-bold mt-8">11.9 O FRANQUEADO escolheu a seguinte opção de Royalties:</h3>
            
            <div className="border-2 border-[#00AAA1] p-4 my-4 text-center text-lg">
               {getSelectedRoyalty()}
            </div>

            <p className="pl-12 mt-4">11.9.1 O valor de royalties começará a ser cobrado no mês subsequente a realização da inauguração, e assim consequentemente nos meses posteriores.</p>
            <p className="pl-12 mt-1">11.9.2 Em caso de atraso superior a 05 (cinco) dias úteis, os títulos não pagos poderão ser protestados;</p>
            <p className="pl-12 mt-1">11.9.3 O inadimplemento por prazo superior a 60 (sessenta) dias fica sob pena de ter o presente CONTRATO rescindido.</p>
            <p className="pl-12 mt-1">11.9.4 As partes estabelecem que havendo atraso no pagamento dos Royalties, serão cobrados juros de mora na proporção de 1% (um por cento) ao mês pro rate die, multa moratória de 10% sobre o saldo devedor, cumulados esses a correção monetária pelo IGPM – Índice Geral de Preços do Mercado – da FGV, ou outro índice que o substituir, além das custas processuais e honorários advocatícios, caso ocorra a rescisão contratual por inadimplência e ação de execução judicial.</p>
         </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 14 */}
         <div>
            <p className="text-right mb-10">15</p>
            <p className="pl-12">11.9.5 Sistemas de gestão:</p>
            <p className="pl-12 mt-1">11.9.6 O <strong>FRANQUEADO</strong> utilizará apenas o sistema de gestão homologado pela <strong>FRANQUEADORA</strong> (MARCA: SEUFISIO). O <strong>FRANQUEADO</strong> deverá obrigatoriamente abastecer o sistema com todas as informações do studio e mantê-lo atualizado diariamente.</p>
            <p className="pl-12 mt-1">11.9.7 Sistemas de gestão possibilitam cadastrar clientes, atividades, grade de horários, contratos com os alunos, de forma geral possibilita ter o controle do Studio;</p>
            <p className="pl-12 mt-1">11.9.8 O sistema de gestão varia de valor <strong>conforme o plano escolhido pelo FRANQUEADO</strong> perante o sistema <strong>SEUFISIO</strong>.</p>
            <p className="pl-12 mt-1">11.9.9 O preenchimento com informações no sistema é obrigatório. (Lembrando que através dessas informações conseguimos ajudar e orientar melhor nossos <strong>FRANQUEADOS</strong>).</p>

            <h3 className="font-bold mt-6">12. NÃO CONCORRÊNCIA E SIGILO DE INFORMAÇÕES</h3>
            <p className="pl-4">12.1 Após o encerramento do contrato de franquia entre as partes, que pode ocorrer por rescisão ou término, o <strong>FRANQUEADO</strong>, na condição de <strong>EX-FRANQUEADO</strong>, por si e seu cônjuge ou companheiro(a), compromete-se a <strong>NÃO</strong> explorar a prestação de serviços de Studio de Pilates <u>no mesmo ponto comercial em que está instalada a <strong>UNIDADE FRANQUEADA</strong> para que não haja crime de concorrência desleal</u>;</p>
            <p className="pl-4 mt-2">12.2 Com o encerramento do contrato de franquia, seja por término ou rescisão, o <strong>FRANQUEADO</strong> poderá atuar com serviços de Pilates em outros pontos comerciais, desde que não utilize marca similar, padrão visual e operacional da franquia, constante nos manuais e plataformas recebidos ou disponibilizados;</p>
            <p className="pl-4 mt-2">12.3 A multa pelo descumprimento das cláusulas supracitadas, acarretará a incidência de multa de 3 (três) vezes o valor da taxa de franquia vigente à época da infração, podendo ser acrescido de valores adicionais a serem apurados em processo judicial, caso as perdas e danos sejam superiores ao valor da cláusula penal ajustada;</p>
            <p className="pl-4 mt-2">12.4 Desde o recebimento da Circular de Oferta de Franquia, o <strong>FRANQUEADO</strong> teve acesso a informações sigilosas e segredos de negócio da <strong>FRANQUEADORA</strong>, não podendo reproduzir ou divulgar qualquer informação a terceiros, mantendo confidencialidade sobre todas as informações a que teve acesso, mesmo após a expiração do presente CONTRATO, sob pena de o infrator incorrer em crime de concorrência desleal, conforme claramente disposto no artigo 195 da Lei 9.279, de 14 de maio de 1996 (Lei de Propriedade Industrial).</p>

            <h3 className="font-bold mt-6">13. DA EVENTUAL SUCESSÃO</h3>
            <p className="pl-4">13.1 No caso de eventual sucessão ou saída de qualquer sócio do <strong>FRANQUEADO</strong>, a <strong>FRANQUEADORA</strong> precisa aprovar a entrada de um novo proprietário, que deve estar em sintonia com os valores e com os pré-requisitos exigidos pela <strong>FRANQUEADORA</strong>.</p>
         </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 15 */}
         <div>
            <p className="text-right mb-10">16</p>
            <p className="pl-4">13.2 O contrato de franquia não poderá ser cedido, total ou parcialmente, pelo <strong>FRANQUEADO</strong>, sem prévia e expressa autorização da <strong>FRANQUEADORA</strong>.</p>
            <p className="pl-4 mt-2">13.3 É expressamente vedado ao <strong>FRANQUEADO</strong> transferir ou ceder para quem quer que seja e a que título for, os direitos e obrigações ajustados no contrato de franquia, exceto se houver prévia e expressa anuência da <strong>FRANQUEADORA</strong>.</p>
            <p className="pl-4 mt-2">13.4 Na hipótese de alienação, onerosa ou gratuita de qualquer parcela de participação societária, retirada, sucessão, falência ou interdição de qualquer sócio do <strong>FRANQUEADO</strong>, a <strong>FRANQUEADORA</strong> poderá, a seu exclusivo critério, considerar rescindido o contrato de franquia, sem que disso resulte direito a indenização ao <strong>FRANQUEADO</strong>, seja a que título for.</p>
            <p className="pl-4 mt-2">13.5 Exclui-se desta restrição a alteração em que a participação societária seja transferida para sócio já integrante do quadro social quando da assinatura do contrato de franquia.</p>

            <h3 className="font-bold mt-6">14. HIPÓTESES DE INFRAÇÃO CONTRATUAL, RESCISÃO ANTECIPADA E CLÁUSULA PENAL</h3>
            <p className="pl-4">14.1. O <strong>FRANQUEADO</strong> poderá rescindir o contrato em qualquer hipótese, desde que avise a <strong>FRANQUEADORA</strong> com antecedência mínima de 90 (noventa) dias;</p>
            <p className="pl-4 mt-2">14.2. O valor de multa por rescisão antecipada nesta situação, será de 50% (cinquenta por cento) sobre os valores de royalties restantes até o final de contrato;</p>
            <p className="pl-4 mt-2">14.3. Em caso de descumprimento pontual de qualquer cláusula deste contrato pelo <strong>FRANQUEADO</strong>, a <strong>FRANQUEADORA</strong> poderá, a seu critério, NOTIFICAR o <strong>FRANQUEADO</strong> da prática da infração apurada, e conceder prazo para sanar a atividade infratora;</p>
            <p className="pl-4 mt-2">14.4. São consideradas infrações graves e suficientes motivos para rescisão imediata do presente contrato qualquer uma das seguintes situações:</p>
            <ol className="list-[upper-roman] pl-12 mt-1">
               <li>O uso inadequado da marca;</li>
               <li>A aquisição de PRODUTOS ou MATERIAIS de FORNECEDORES não homologados;</li>
               <li>O atraso no pagamento dos royalties com prazo superior a 2 (dois) meses;</li>
               <li>A paralisação das atividades da UNIDADE sem aviso prévio e sem autorização da <strong>FRANQUEADORA</strong>;</li>
               <li>A suspensão da prestação de serviços na UNIDADE, sem autorização da <strong>FRANQUEADORA</strong>;</li>
               <li>A falência, insolvência, pedido de recuperação judicial, intervenção, liquidação ou dissolução de qualquer uma das partes, ou ainda configuração de situação pré-falimentar ou pré-insolvência, inclusive com títulos vencidos e protestados, ou ações de execução, que comprometam a solidez financeira e a manutenção dos negócios;</li>
               <li>A exposição vergonhosa da marca de forma que denigra a sua imagem.</li>
            </ol>
         </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 16 */}
         <div>
            <p className="text-right mb-10">17</p>
            <p className="pl-4">14.5. As rescisões de contrato por infrações ou penalidades acima descritas dão direito a aplicação de multa no valor de R$ 8.000,00 (oito mil reais);</p>
            <p className="pl-4 mt-2">14.6. O presente contrato poderá ser rescindido por comum acordo entre as partes, mediante distrato, na presença de duas testemunhas. Neste caso, não há a incidência de multa contratual, mas o <strong>FRANQUEADO</strong> se obriga a pagar uma taxa de vistoria e encerramento das atividades que será a soma do valor de deslocamento, alimentação e estadia do fiscal da empresa que vier a realizar o ato;</p>
            <p className="pl-4 mt-2">14.7. Em qualquer caso de rescisão de contrato, os efeitos serão imediatos, ou seja, o <strong>FRANQUEADO</strong>, na condição de <strong>EX-FRANQUEADO</strong>, deve imediatamente deixar de usar a marca e aplica-se de imediato todas as cláusulas deste contrato inerentes ao sigilo, know-how, segredo de marca e não concorrência.</p>

            <h3 className="font-bold mt-6">15. DISPOSIÇÕES GERAIS</h3>
            <p className="pl-4">15.1. A tolerância, por qualquer uma das partes, quanto ao inadimplemento das obrigações contratuais não implica em novação ou modificação das cláusulas aqui ajustadas, constituindo mera liberalidade;</p>
            <p className="pl-4 mt-2">15.2. O presente contrato poderá ser alterado por comum acordo entre as partes, sendo feito por meio de aditivo por escrito;</p>
            <p className="pl-4 mt-2">15.3. O presente contrato tem validade e vigência desde sua assinatura, independentemente de ser levado a registro;</p>
            <p className="pl-4 mt-2">15.4. A cessão ou transferência dos direitos relativos a este CONTRATO, assim como as mudanças e alterações no quadro societário da UNIDADE, ou qualquer outra alteração no Contrato Social da <strong>EMPRESA FRANQUEADA</strong>, somente poderá se efetivar após prévio e expresso consentimento da <strong>FRANQUEADORA</strong>;</p>
            <p className="pl-4 mt-2">15.5. O <strong>FRANQUEADO</strong> declara entender que o presente contrato tem caráter personalíssimo, sendo as obrigações e direitos aqui contidos vinculados exclusivamente à pessoa física do <strong>FRANQUEADO</strong>, bem como eventuais sócios que se obriguem solidariamente neste CONTRATO, de modo que a alteração no quadro societário não desvinculará o <strong>FRANQUEADO</strong> de nenhuma cláusula constante nesse CONTRATO.</p>
         </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 17 */}
         <div>
            <p className="text-right mb-10">18</p>
            <h3 className="font-bold mt-6">16. ELEIÇÃO DE FORO</h3>
            <p className="pl-4">16.1 As partes elegem o <strong>Foro da cidade (São Paulo/SP)</strong>, para dirimir quaisquer dúvidas ou questões oriundas do presente instrumento, em detrimento a outros, por mais privilegiados que sejam ou venham a se tornar;</p>
            <p className="pl-4 mt-2">16.2 A lei aplicável à controvérsia será a <strong>13.966/2019</strong> – Lei de Franquias, juntamente com o Código Civil Brasileiro e legislação aplicável. E estando assim acordadas, justas e contratadas, cientes do inteiro teor de todas as cláusulas a que se comprometem, as partes assinam o presente <strong>CONTRATO DE FRANQUIA</strong>, no mais estrito cumprimento à <strong>Lei nº 13.966/2019</strong>, na presença das testemunhas abaixo, para que produza imediatamente seus efeitos.</p>
         </div>

         <div className="html2pdf__page-break"></div>

         {/* Page 18 Signatures */}
         <div>
             <p className="text-right mb-10">19</p>
             
             <div className="text-center font-bold mt-20 mb-20 uppercase">
               {data.cidadeAssinatura.toUpperCase()}, {formatDateFull(data.dataAssinatura)}
             </div>

             <div className="space-y-24">
               
               <div className="text-center">
                 <div className="border-t border-black w-2/3 mx-auto pt-2"></div>
                 <p className="font-bold">WOLF GESTÃO DE ATIVOS LTDA – VOLL PILATES STUDIOS</p>
                 <p className="text-sm">CNPJ: 33.489.631/0001-75 – FRANQUEADORA</p>
               </div>

               <div className="text-center">
                 <div className="border-t border-black w-2/3 mx-auto pt-2"></div>
                 <p className="font-bold uppercase">{data.nome}</p>
                 <p className="text-sm uppercase">RG: {data.rg} CPF: {data.cpf}</p>
                 <p className="text-sm font-bold">FRANQUEADO(A)</p>
               </div>

               <div className="grid grid-cols-2 gap-x-10 gap-y-20 mt-20">
                 {data.testemunhas.map((wit, idx) => (
                    <div className="text-center" key={wit.id}>
                        <div className="border-t border-black w-4/5 mx-auto pt-2"></div>
                        <p className="font-bold uppercase">TESTEMUNHA {idx + 1}</p>
                        <p className="text-sm">CPF: {wit.cpf}</p>
                        <p className="text-sm">RG: {wit.rg}</p>
                    </div>
                 ))}
               </div>
             </div>
         </div>

      </div>
    </div>
  );
};

export default ContractTemplate;
