import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

function BackendDataRow({row}) {
  const url = row['url'] ? row['url'] : 'FAILED TO LAUNCH'
  return (
    <>
      <td>drop 4</td>
      <td>{url}</td>
      <td>{row['created_at']}</td>
    </>
  )
}

function Table({sqlData}) {
  console.log("hey were in table and sql data is a", sqlData)
  const rows = sqlData.map(row => {
    return (
      <tr key={row.id}>
        <BackendDataRow row={row}/>
      </tr>
    )
  })
  return (
    <div className="backendData">
      <h3>Previous URLs</h3>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>url</th>
            <th>time created</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>

    </div>
  )
}

function App() {
  const [dropFourUrl, setDropFourUrl] = useState('');
  const [sqlData, setSqlData] = useState([]);

  useEffect(() => {
    const getBackendData = async () => {
      const backendData = await axios.get("http://localhost:3001/service/1/backends")
      console.log('ln 50 backendData', backendData.data)
      setSqlData(backendData.data)
    }
    getBackendData();
  }, [])

  const getUrl = async (imageName) => {
    const {data} = await axios.get(`http://localhost:3001/services/${imageName}`, 
      { headers: {"Access-Control-Allow-Origin": '*'}});
    console.log(data)
    setSqlData(sqlData.concat([{ name: 'drop 4', url: data, created_at: 'Created Just Now'}]))
    if (imageName === "dropFour") {
      setDropFourUrl(data);
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
        <h2>Click the button to receive a url for your drop4 game</h2>
        <button onClick={() => getUrl("dropFour")}>Get URL</button>
        <p>Your url: <a href={dropFourUrl} target='_blank' rel="noreferrer">{dropFourUrl}</a></p>
        <Table sqlData={sqlData} />
      </main>
    </div>
  );
}

export default App;
