import React, { useState } from 'react';

const JogoBesta = () => {
  const [pontos, setPontos] = useState(0);
  const [mensagem, setMensagem] = useState('Clique no botão para ganhar pontos!');

  const clicar = () => {
    const ganho = Math.floor(Math.random() * 10) + 1;
    setPontos(pontos + ganho);
    setMensagem(`Você ganhou ${ganho} ponto(s)!`);
  };

  const resetar = () => {
    setPontos(0);
    setMensagem('Jogo resetado. Clique novamente!');
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Jogo Besta</h2>
      <p>{mensagem}</p>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pontos: {pontos}</p>
      <button onClick={clicar} style={{ padding: '1rem 2rem', fontSize: '1.2rem', margin: '0.5rem', cursor: 'pointer' }}>
        Clique aqui!
      </button>
      <button onClick={resetar} style={{ padding: '0.5rem 1rem', fontSize: '1rem', margin: '0.5rem', cursor: 'pointer' }}>
        Resetar
      </button>
    </div>
  );
};

export default JogoBesta;
