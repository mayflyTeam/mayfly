import { useState, useEffect } from 'react'
import './App.css'
import logo from "./assets/logo.png"
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams
} from 'react-router-dom'
import axios from 'axios'

const Header = ({ text }: { text: string }) => {
  return (
    <h1>{text}</h1>
  )
}

const NavHome = () => {
  return (
    <p>
      <Link to="/services"><span>Hatch A Service</span></Link> | <span><a href="#">Add Your Own Service</a></span>
    </p>
  )
}

const Logo = ({className}: {className: string}) => {
  return <img className={className} src={logo} alt="mayfly logo" />
}

const InfoBox = () => {
  return (
    <div className='infoBox'>
      <article>
        Session backends are browser based...Mit einem Verlobungsvertrag hatte 
        Joseph Bendix aus Billerbeck mit Bräunchen, der Witwe des Dülmener Metzgers 
        Hirz Pins, am 23. September 1823 die Ehe seines Sohnes Moses mit Sara Pins 
        vereinbart. Beide Familien waren jüdisch und Pins seit 1719 in Dülmen ansässig. 
        Sara erhielt laut Vereinbarung von ihrer Mutter deren Wohnhaus an der Dülmener
         Münsterstraße 86 sowie 500 Taler aus dem väterlichen Erbe. Moses erhielt ebenfalls 
         eine Mitgift. Die Hochzeit erfolgte am 3. März 1824 und im gleichen Jahr eröffnete 
         der Kaufmann Moses Bendix mit einem Kapital von 1.000 Talern in einem Haus an der 
         Königstraße (Viktorstraße) in Dülmen ein Leinenhandelsgeschäft wo er von Dülmener 
         Spinnern und Webern in Heimarbeit gesponnene Garne und gewebte Stoffe aufgekaufte 
         und weiter veräußerte.
      </article>
    </div>
  )
}

const HomePage = () => {
  return (
    <div className="containerHome">
     <Header text={"Welcome to Mayfly"} />
     <NavHome />
     <Logo className="logoHome"/>
     <main>
      <InfoBox />
     </main>
    </div>
  )
}

const NavServices = () => {
  return (
    <p>
      <span><Link to="/home">Home</Link></span> | <span><a href="#">Add Your Own Service</a></span>
    </p>
  )
}

interface ServiceObject {
  id: number
  name: string
}

const Service = ({service}: {service: ServiceObject}) => {
  const serviceName: string = service.name
  return (
    <Link to={`/services/${serviceName}`}><li key={service.id}>{service.name}</li></Link>
  )
}



const ServiceList = ({services}: {services: ServiceObject[]}) => {
  
  const list = services.map(service => <Service service={service} />)
  return (
    <ul className="serviceList">
      {list}
    </ul>
  )
}

const ServicesPage = () => {
  
  //const [servicesUser, setServicesUser] = useState({arr}: {Array<ServiceObject>})
  const [servicesUser, setServicesUser] = useState<Array<ServiceObject>>([]);
  const [servicesGlobal, setServicesGlobal] = useState<Array<ServiceObject>>([]);

  useEffect(() => {
    const userId = 1;
    const getServicesUser = async () => {
      const { data } = await axios.get(`http://localhost:3000/${userId}/servicesUser`)
      setServicesUser(data) 
    }

    const getServicesGlobal = async () => {
      const { data } = await axios.get(`http://localhost:3000/${userId}/servicesGlobal`)
      setServicesGlobal(data) 
    }

    getServicesUser()
    getServicesGlobal()
  }, [])

  return (
    <div className="containerServices">
      <Header text={"Services"}/>
      <NavServices />
      <Logo className="logoHome"/>
      <h2>Steve List</h2>
      <ServiceList services={servicesGlobal}/>
      <h2>Zach List</h2>
      <ServiceList services={servicesUser}/>
    </div>
  )
}

const NavSingleService = () => {
  return (
    <p>
      <span><Link to="/home">Home</Link></span> | <span><Link to="/services">Back to Services</Link></span> | <span><a href="#">Add Your Own Service</a></span>
    </p>
  )
}

// const Backend = ({ backend } : { backend: BackendInfo } ) => {
//   return (
//     <>
//     <li>{backend.url} | {backend.createdAt} | {backend.terminatedAt ? backend.terminatedAt : <SquishButton />}</li>
//     </>
//   )
// }

interface BackendInfo {
  url: string,
  launchSuccess: boolean
  hatchedAt: string,
  squishedAt: string
}

const BackendTableRow = ({backend}: {backend: BackendInfo}) => {
  const buttonNotPresent = backend.squishedAt ? backend.squishedAt : <SquishButton />
  return (
    <tr className={typeof buttonNotPresent === "string" ? "" : "highlightBackend"} key={backend.url}>
      <td>{backend.url}</td>
      <td>{String(backend.launchSuccess)}</td>
      <td>{backend.hatchedAt}</td>
      <td>{buttonNotPresent}</td>
    </tr>
  )
}

const BackendList = ({steveList, zachList}: BackendInfo[]) => {
  //add slow loading network
  
  const steveRows = steveList.map(backend => <BackendTableRow backend={backend} />)
  const zachRows = zachList.map(backend => <BackendTableRow backend={backend} />)
  return (
    <>
    <div className="backendTable">
      <h2>Steve's Table</h2>
      <table>
        <thead>
          <tr>
            <th>Url</th>
            <th>Launch Success</th>
            <th>Hatched At</th>
            <th>Squished At</th>
          </tr>
        </thead>
        {steveRows}
      </table>
      <h2>Zach's Table</h2>
      <table>
        <thead>
          <tr>
            <th>Url</th>
            <th>Launch Success</th>
            <th>Hatched At</th>
            <th>Squished At</th>
          </tr>
        </thead>
        {zachRows}
      </table>
    </div> 

    </>
  )
}

const HatchButton = ({handleClick, handleLoad, load}) => {
  const hatchService = (e) => {
    e.preventDefault()
    handleClick()
    handleLoad()
    load = true
  }
  return (
    <div>
      <button disabled={load} onClick={hatchService} className="backendButton hatchButton">Hatch</button>
    </div>
  )
}

const SquishButton = () => {
  return (
    <button className="backendButton squishButton">Squish</button>
  )
}

const LoadingText = ({loadingState}: {loadingState: boolean}) => {
  const text = "Your backend is being prepared..."
  const nothing = ""
  const display = loadingState ? text : nothing
  return (
    <div className="loadingText">{display}</div>
  )
}

const BackendPage = () => {
  const user: string = '1';
  const service: string = useParams()['service'] || '';

  const [backendsUser, setBackendsUser] = useState<Array<BackendInfo>>([])
  const [backendsGlobal, setBackendsGlobal] = useState<Array<BackendInfo>>([])
  const serviceName: string = useParams()['service'] || ""

  const getBackendsUser = async () => {
    const { data } = await axios.get(`http://localhost:3000/1/servicesUser/${serviceName}`)
    setBackendsUser(data)
  }

  const getBackendsGlobal = async () => {
    const { data } = await axios.get(`http://localhost:3000/1/servicesGlobal/${serviceName}`)
    setBackendsGlobal(data);
  }

  useEffect(() => {
    //type issues
    getBackendsUser()
    getBackendsGlobal()
  }, [])
  
  const [loading, isLoading] = useState(false)

  const changeLoadState = () => {
    isLoading(true)
  }

  const getUrl = () => {
    axios.get(`http://localhost:3000/${user}/services/${service}/hatch`)
    .then(response => {
      //data.url, data.launch_success, data.service_id, response.error
      //response could be url or error try again
      const data = response.data
   
      //highlight table row
      let url: string = data.url
      const squishedAt = data.launchSuccess ? "" : "2023-10-28T19:45:51.673Z"
      if (data.error) { url = "launch failure"}
      const newRow: BackendInfo = {url, launchSuccess: data.launchSuccess, hatchedAt: "2023-10-28T19:45:51.673Z", squishedAt}
      setBackendsGlobal([newRow].concat(backendsGlobal))
      isLoading(false)
    
    })
    .catch(error => {
      //when the call to the api fails
      console.log('hatch call from frontend fail')
    })
  }
  

  return (
    <div className="containerSingleService">
    <Header text={service}/>
    <NavSingleService />
    <Logo className="logoHome" />
    <LoadingText loadingState={loading} />
    <HatchButton handleClick={getUrl} handleLoad={changeLoadState} load={loading} />
    <BackendList steveList={backendsGlobal} zachList={backendsUser} />
  </div>
  )
 
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:service" element={<BackendPage />} />
      </Routes>
    </Router>
  )
}

export default App
