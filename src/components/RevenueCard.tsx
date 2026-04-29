// Componente de card individual para cada receita

const RevenueCard = ({ item, onDelete }) => {
  const hoje = new Date();
  const vencimento = new Date(item.dataVencimento);
  const diff = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
  const vencido = diff < 0;
  const venceHoje = diff === 0;

  const mensagemCobranca = encodeURIComponent(
    `Olá ${item.nome}, tudo bem? Lembrando que a receita que você pegou no dia ${item.dataPegou} venceu! Por favor, regularize o quanto antes. Obrigado!`
  );
  const linkWhatsapp = `https://wa.me/${item.whatsapp}?text=${mensagemCobranca}`;

  return (
    <div className={`revenue-card ${vencido ? 'vencido' : venceHoje ? 'vence-hoje' : ''}`}>
      <div className="card-header">
        <strong>{item.nome}</strong>
        <span className="status-badge">
          {vencido ? '⚠️ Vencido' : venceHoje ? '⏰ Vence hoje' : `✅ ${diff} dias restantes`}
        </span>
      </div>
      <div className="card-body">
        <p><strong>Quem pegou:</strong> {item.quemPegou}</p>
        <p><strong>Data que pegou:</strong> {item.dataPegou}</p>
        <p><strong>Vencimento:</strong> {item.dataVencimento}</p>
        <p><strong>WhatsApp:</strong> {item.whatsapp}</p>
      </div>
      <div className="card-actions">
        <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          💬 Cobrar via WhatsApp
        </a>
        <button onClick={() => onDelete(item.id)} className="btn-delete">Excluir</button>
      </div>
    </div>
  );
};
