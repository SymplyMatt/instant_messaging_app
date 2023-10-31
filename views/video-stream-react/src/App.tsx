import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';

function App() {
  let [ socket, setSocket] = useState<any>();
  useEffect(() => {
    async function connSocket() {
      try {
        const socket:any = await io('http://localhost:3002');
        setSocket(socket);

        
        socket.on('score', (balance: number, points_won : number ) => {

        });

        return () => {
          socket.disconnect();
        }; 
      } catch (error) {
        console.log(error);
      }
    }
    connSocket()
  }, []);
  return (
    <div className="App">
      Hello
    </div>
  );
}

export default App;
