import { useState } from 'react';
import './App.css';
import { VideoRoom } from './components/VideoRoom';

function App() {
  const [joined, setJoined] = useState(false);
  const [leave,setLeave] = useState(false);
  console.log('inleave');
  return (
    <div className="App">
      <h1>WDJ Virtual Call</h1>

      {!joined && (
        <button onClick={() => setJoined(true)}>
          Join Room
        </button>
      )}
      {
        joined && (
          <button onClick={() => document.location ='/'}>
            Leave Room
          </button>
        )

      }

      {joined && <VideoRoom leave={leave}/>}
      
    </div>
  );
}

export default App;