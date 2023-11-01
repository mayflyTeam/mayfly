import { useState, useEffect } from 'react'
import arrow from "../src/assets/downArrow.png"
import logoNoText from "../src/assets/transparentLogoNoText.png"
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams
} from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'

interface BackendInfo {
  url: string,
  launchSuccess: boolean
  hatchedAt: string,
  squishedAt: string
}

const convertDate = (date: string): string => {
  const utcDate = new Date(date);
  const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  const localDateString = localDate.toLocaleString();
  return localDateString.replace(",", "")
}

const BackendTableRow: React.FC = ({backend, idx}: {backend: BackendInfo, idx: number}) => {
  const buttonNotPresent = backend.squishedAt ? convertDate(backend.squishedAt) : <SquishButton />
  const launchText: string = String(backend.launchSuccess) === "true" ? "success" : "Loading..."
  return (
    <tr className="text-sm">
      <td className="p-5 underline"><a className="hover:text-red-500"href={backend.url}>backend {idx}</a></td>
      <td className="p-5">{launchText}</td>
      <td className="p-5">{convertDate(backend.hatchedAt)}</td>
      <td className="p-5">{buttonNotPresent}</td>
    </tr>
  )
}

const BackendList: React.FC = ({list}: {list: BackendInfo[]}) => {
  if (list.length === 0) {
    return <p className="m-auto mt-0 p-5 bg-white rounded-xl shadow-2xl">You haven't hatched any backends yet...</p>
  }

  //add slow loading network
  
  const rows = list.map((backend, idx) => {
    return <BackendTableRow backend={backend} key={backend.url} idx={list.length - idx} />
})
  
  return (
    <>
          {/* <div className="flex items-center bg-slate-800 h-screen table-auto overflow-auto"> */}
      <div className="m-auto mt-1 p-5 font-josefin bg-white rounded-xl shadow-2xl table-auto">
        <table>
          <thead className="border-b-2 border-black">
            <tr>
              <th>Link</th>
              <th>Launch Status</th>
              <th>Hatched At</th>
              <th>Squished At</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div> 
    </>
  )
}


const HatchButton: React.FC = ({handleClick, handleLoad, load}: {handleClick: Function, handleLoad: Function, load: boolean}) => {
  const hatchService = (e) => {
    e.preventDefault()
    handleClick()
    handleLoad()
  }
  return (
    <div className="flex flex-col m-auto mt-10 mb-10 relative">
        <p className="font-josefin text-2xl text-red-800">Hatch a Service</p>
        {/* <img className="h-16 w-16 red-500" src={arrow} /> */}
        <button
          // className="h-14 w-12 rounded-b-3xl border-2 border-green-500 rounded-t-3xl inset-0 bg-white bg-[radial-gradient(#ef4444_1px,transparent_4px)] [background-size:16px_16px]"
          className="bg-[#C5D0E3] h-20 w-20 rounded-full flex items-center justify-center animate-bounce"
          disabled={load}
          onClick={hatchService}
        >
          <img src={logoNoText} className="h-20 w-20 rounded-full hover:animate-spin-slow" />
        </button>
    </div>
  )
}

const SquishButton = () => {
  return (
    <button className="backendButton squishButton">Squish</button>
  )
}

const Loading = ({loadingState}: {loadingState: boolean}) => {
  const display = loadingState ? <Modal /> : null
  return (
    <div className="loadingText">{display}</div>
  )
}

const Modal: React.FC = () => {
  return (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div className="bg-gray-300 p-8 rounded-lg shadow-lg text-center">
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-slate-800 fill-green-700"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
</div>
  )
}

 const BackendPage: React.FC = () => {
  const user: string = '1';
  const service: string = useParams()['service'] || '';
  const [load, setLoad] = useState(false)

  const [backends, setBackends] = useState<Array<BackendInfo>>([])
  const serviceName: string = useParams()['service'] || ""

  const getBackends = async () => {
    const { data } = await axios.get(`http://localhost:3000/1/services/${serviceName}`)
    setBackends(data);
  }

  useEffect(() => {
    getBackends()
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
      console.log("data", data)
      //highlight table row
      let url: string = data.url
      const squishedAt = data.launchSuccess ? "" : "2023-10-28T19:45:51.673Z"
      if (data.error) { url = "launch failure"}
      const newRow: BackendInfo = {url, launchSuccess: data.launchSuccess, hatchedAt: "2023-10-28T19:45:51.673Z", squishedAt}
      setBackends([newRow].concat(backends))
      isLoading(false)
    
    })
    .catch(error => {
      //when the call to the api fails
      console.log('hatch call from frontend fail')
    })
  }
  const backendFull = "flex items-center bg-slate-800 h-full"
  const backendScreen = "flex items-center bg-slate-800 h-screen"
  const backendClass = backends.length > 6 ? backendFull : backendScreen
  

  return (
    <>
     
      <div className="h-auto flex items-center justify-center bg-slate-800">
      <p className='flex ml-auto font-josefin text-white text-5xl align-center'>{serviceName}</p>
        <HatchButton handleClick={getUrl} handleLoad={changeLoadState} load={load}  />
      </div>
      <div className={backendClass}>
        <BackendList list={backends} />
        <Loading loadingState={loading} />
      </div>  
    </>
    
  )
 
}

export default BackendPage