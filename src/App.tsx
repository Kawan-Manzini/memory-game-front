import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const App: React.FC = () => {
  // Definindo estados para o componente
  const [socket, setSocket] = useState<Socket | null>(null); // Estado para o objeto de conexão WebSocket
  const [guess, setGuess] = useState<number | undefined>(undefined); // Estado para a suposição do jogador
  const [message, setMessage] = useState<string>(''); // Estado para mensagens do jogo

  // Efeito colateral que é executado quando o componente é montado
  useEffect(() => {
    // Cria uma instância do cliente WebSocket e se conecta a um servidor na URL especificada
    const socket = io('http://localhost:8080'); // Altere a URL do servidor conforme necessário

    // Define um ouvinte para o evento 'connect', que é acionado quando a conexão é estabelecida
    socket.on('connect', () => {
      setSocket(socket); // Atualiza o estado 'socket' com a conexão estabelecida
    });

    // Define um ouvinte para o evento 'message', que recebe mensagens do servidor
    socket.on('message', (data) => {
      setMessage(data); // Atualiza o estado 'message' com a mensagem recebida
    });

    // Define uma função de retorno que é executada quando o componente é desmontado
    return () => {
      socket.disconnect(); // Desconecta o WebSocket quando o componente é desmontado
    };
  }, []); // O array vazio [] garante que este efeito seja executado apenas uma vez no início

  // Função chamada quando o jogador clica no botão "Guess"
  const handleGuess = () => {
    if (guess !== undefined && socket) {
      socket.emit('guess', guess); // Envia a suposição para o servidor via WebSocket
    }
  };

  // Renderização do componente
  return (
    <div className='flex content-center '>
      <h1>Real-time Guessing Game</h1>
      <div>
        <input
          type="number"
          placeholder="Enter your guess"
          onChange={(e) => setGuess(parseInt(e.target.value))} // Atualiza o estado 'guess' com o valor digitado
        />
        {/* // Chama a função handleGuess quando o botão é clicado */}
        <button onClick={handleGuess}>Guess</button> 
      </div>
      {/* // Exibe a mensagem se houver alguma */}
      {message && <p>{message}</p>} 
    </div>
  );
};

export default App;