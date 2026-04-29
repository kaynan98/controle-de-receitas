// Componente de listagem de receitas

const RevenueList = ({ items, onDelete }) => {
  if (items.length === 0) {
    return <p className="empty-message">Nenhuma receita pendente no momento.</p>;
  }

  return (
    <div className="revenue-list">
      <h2>Receitas Pendentes ({items.length})</h2>
      {items.map((item) => (
        <RevenueCard key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
};
