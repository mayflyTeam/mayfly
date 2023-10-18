import axios from 'axios';
import { useState } from 'react';
import './App.css';

function App() {
  const [dropFourUrl, setDropFourUrl] = useState('');
  const [jupyterUrl, setJupyterUrl] = useState("")
  const getUrl = async (imageName) => {
    const {data} = await axios.get(`http://localhost:3001/services/${imageName}`, 
      { headers: {"Access-Control-Allow-Origin": '*'}});
    console.log(data)
    if (imageName === "dropFour") {
      setDropFourUrl(data);
    } else if (imageName === "jupyterNotebook") {
      setJupyterUrl(data)
    } else {
      console.log('invalid service')
    }
    
  }

  return (
    <div className="App">
      <header className="App-header">
        Launch Your App
      </header>
      <main>
        <h2>Click the button to receive a url for your drop4</h2>
        <button onClick={() => getUrl("dropFour")}>Get URL</button>
        <p>Your url: <a href={dropFourUrl} target='_blank' rel="noreferrer">{dropFourUrl}</a></p>
        <h2>Click the button to receive a url for your notebook</h2>
        <button onClick={() => getUrl("jupyterNotebook")}>Get URL</button>
        <p>Your url: <a href={jupyterUrl} target='_blank' rel="noreferrer">{jupyterUrl}</a></p>
      </main>
    </div>
  );
}

export default App;
