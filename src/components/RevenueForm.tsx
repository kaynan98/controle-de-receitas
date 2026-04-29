// Componente de formulário para adicionar receita pendente

const RevenueForm = ({ onAdd }) => {
  const [nome, setNome] = React.useState('');
  const [quemPegou, setQuemPegou] = React.useState('');
  const [dataPegou, setDataPegou] = React.useState('');
  const [dataVencimento, setDataVencimento] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !quemPegou || !dataPegou || !dataVencimento || !whatsapp) {
      alert('Preencha todos os campos!');
      return;
    }
    onAdd({ nome, quemPegou, dataPegou, dataVencimento, whatsapp });
    setNome('');
    setQuemPegou('');
    setDataPegou('');
    setDataVencimento('');
    setWhatsapp('');
  };

  return (
    <form className="revenue-form" onSubmit={handleSubmit}>
      <h2>Adicionar Receita Pendente</h2>
      <label>
        Nome da Pessoa:
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva" />
      </label>
      <label>
        Quem Pegou:
        <input type="text" value={quemPegou} onChange={(e) => setQuemPegou(e.target.value)} placeholder="Ex: Maria" />
      </label>
      <label>
        Data que Pegou:
        <input type="date" value={dataPegou} onChange={(e) => setDataPegou(e.target.value)} />
      </label>
      <label>
        Data de Vencimento:
        <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} />
      </label>
      <label>
        WhatsApp (com DDD, só números):
        <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ex: 5511999999999" />
      </label>
      <button type="submit">Adicionar</button>
    </form>
  );
};
