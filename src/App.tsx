import React from 'react';
import RevenueForm from './components/RevenueForm';
import RevenueList from './components/RevenueList';
import './styles/Revenue.css';

const App = () => {
  const [items, setItems] = React.useState(() => {
    const saved = localStorage.getItem('receitas');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('receitas', JSON.stringify(items));
  }, [items]);

  const handleAdd = (nova) => {
    const item = { ...nova, id: Date.now() };
    setItems([...items, item]);
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  React.useEffect(() => {
    const hoje = new Date();
    const vencidos = items.filter(item => new Date(item.dataVencimento) < hoje);
    if (vencidos.length > 0) {
      alert(`⚠️ ${vencidos.length} receita(s) vencida(s)! Verifique a lista.`);
    }
  }, []);

  return (
    <div className="revenue-container">
      <h1>Controle de Receitas Pendentes</h1>
      <RevenueForm onAdd={handleAdd} />
      <RevenueList items={items} onDelete={handleDelete} />
    </div>
  );
};

export default App;
