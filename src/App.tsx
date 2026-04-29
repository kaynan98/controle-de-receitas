import React, { useState } from 'react';

function App() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [diferenca, setDiferenca] = useState<{ dias: number; meses: number; anos: number } | null>(null);

  const calcularDiferenca = () => {
    if (!dataInicio || !dataFim) return;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    if (fim < inicio) {
      alert('A data final deve ser maior ou igual à data inicial.');
      return;
    }
    const diffMs = fim.getTime() - inicio.getTime();
    const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const anos = Math.floor(dias / 365);
    const meses = Math.floor((dias % 365) / 30);
    const diasRestantes = dias - (anos * 365) - (meses * 30);
    setDiferenca({ dias, meses, anos: anos + (meses >= 12 ? 1 : 0) });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Calculadora de Diferença entre Datas</h1>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Data Inicial:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Data Final:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>
        <button
          onClick={calcularDiferenca}
          style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          Calcular Diferença
        </button>
        {diferenca && (
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#e0f2fe', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Resultado:</h2>
            <p><strong>Dias:</strong> {diferenca.dias}</p>
            <p><strong>Meses:</strong> {diferenca.meses}</p>
            <p><strong>Anos:</strong> {diferenca.anos}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
