import React, { useState } from 'react';

interface Evento {
  id: number;
  titulo: string;
  data: string;
  tipo: 'aniversario' | 'reuniao' | 'feriado';
}

interface Diferenca {
  dias: number;
  meses: number;
  anos: number;
}

const eventosMock: Evento[] = [
  { id: 1, titulo: 'Aniversário João', data: '2025-03-15', tipo: 'aniversario' },
  { id: 2, titulo: 'Reunião Equipe', data: '2025-03-20', tipo: 'reuniao' },
  { id: 3, titulo: 'Feriado Nacional', data: '2025-04-21', tipo: 'feriado' },
];

function App() {
  const [abaAtiva, setAbaAtiva] = useState<'calculadora' | 'calendario' | 'vencimentos' | 'lembretes'>('calculadora');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [diferenca, setDiferenca] = useState<Diferenca | null>(null);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  const calcularDiferenca = () => {
    if (!dataInicio || !dataFim) return;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    if (fim < inicio) {
      alert('A data final deve ser maior ou igual à data inicial.');
      return;
    }
    const diffMs = fim.getTime() - inicio.getTime();
    const diasTotais = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let anos = 0;
    let meses = 0;
    let dias = diasTotais;
    while (dias >= 365) {
      anos++;
      dias -= 365;
    }
    while (dias >= 30) {
      meses++;
      dias -= 30;
    }
    setDiferenca({ dias, meses, anos });
  };

  const diasNoMes = (mes: number, ano: number) => new Date(ano, mes + 1, 0).getDate();
  const primeiroDiaSemana = (mes: number, ano: number) => new Date(ano, mes, 1).getDay();

  const renderCalendario = () => {
    const totalDias = diasNoMes(mesAtual, anoAtual);
    const primeiroDia = primeiroDiaSemana(mesAtual, anoAtual);
    const dias = [];
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(<div key={`vazio-${i}`} style={{ padding: '8px' }}></div>);
    }
    for (let dia = 1; dia <= totalDias; dia++) {
      const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const temEvento = eventosMock.some(e => e.data === dataStr);
      dias.push(
        <div
          key={dia}
          style={{
            padding: '8px',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            backgroundColor: temEvento ? '#fef3c7' : 'transparent',
            fontWeight: temEvento ? 'bold' : 'normal',
          }}
        >
          {dia}
        </div>
      );
    }
    return dias;
  };

  const renderVencimentos = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Eventos / Vencimentos</h3>
      {eventosMock.length === 0 ? (
        <p>Nenhum evento cadastrado.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {eventosMock.map(evento => (
            <li key={evento.id} style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
              <span>{evento.titulo}</span>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderLembretes = () => {
    const hoje = new Date();
    const daqui7dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    const proximos = eventosMock.filter(e => {
      const dataEvento = new Date(e.data);
      return dataEvento >= hoje && dataEvento <= daqui7dias;
    });
    return (
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Lembretes (próximos 7 dias)</h3>
        {proximos.length === 0 ? (
          <p>Nenhum evento nos próximos 7 dias.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {proximos.map(evento => (
              <li key={evento.id} style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', backgroundColor: '#dbeafe' }}>
                <span>{evento.titulo}</span>
                <span style={{ color: '#2563eb', fontSize: '14px' }}>{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const abas = [
    { chave: 'calculadora' as const, label: 'Calculadora' },
    { chave: 'calendario' as const, label: 'Calendário' },
    { chave: 'vencimentos' as const, label: 'Vencimentos' },
    { chave: 'lembretes' as const, label: 'Lembretes' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Sistema de Datas</h1>
        
        {/* Abas de navegação */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
          {abas.map(aba => (
            <button
              key={aba.chave}
              onClick={() => setAbaAtiva(aba.chave)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: abaAtiva === aba.chave ? '#3b82f6' : '#e5e7eb',
                color: abaAtiva === aba.chave ? '#fff' : '#374151',
                fontWeight: abaAtiva === aba.chave ? 'bold' : 'normal',
              }}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        {abaAtiva === 'calculadora' && (
          <div>
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
        )}

        {abaAtiva === 'calendario' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button
                onClick={() => {
                  if (mesAtual === 0) {
                    setMesAtual(11);
                    setAnoAtual(anoAtual - 1);
                  } else {
                    setMesAtual(mesAtual - 1);
                  }
                }}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                ◀
              </button>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                {new Date(anoAtual, mesAtual).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => {
                  if (mesAtual === 11) {
                    setMesAtual(0);
                    setAnoAtual(anoAtual + 1);
                  } else {
                    setMesAtual(mesAtual + 1);
                  }
                }}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
              >
                ▶
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <div key={dia} style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px', backgroundColor: '#f9fafb' }}>
                  {dia}
                </div>
              ))}
              {renderCalendario()}
            </div>
          </div>
        )}

        {abaAtiva === 'vencimentos' && renderVencimentos()}
        {abaAtiva === 'lembretes' && renderLembretes()}
      </div>
    </div>
  );
}

export default App;
