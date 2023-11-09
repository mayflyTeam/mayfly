import { useState, useEffect, ReactNode, ReactElement, MouseEvent } from 'react'
import logoNoText from "../assets/transparentLogoNoText.png"
import { useParams } from 'react-router-dom'
import Modal from './Modal'
import axios from 'axios'

interface BackendInfo {
  url: string,
  launchSuccess: boolean
  hatchedAt: string,
  squishedAt: string
}

const convertDate = (date: string): string => {
  const utcDate: Date = new Date(date);
  const localDate: Date = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  const localDateString: string = localDate.toLocaleString();
  return localDateString.replace(",", "")
}

interface BackendTableRowProps {
  backend: BackendInfo,
  idx: number
}

const BackendTableRow = ({backend, idx}: BackendTableRowProps) => {
  const buttonNotPresent: string | ReactElement = backend.squishedAt ? convertDate(backend.squishedAt) : <SquishButton />
  const launchText: string = String(backend.launchSuccess) === "true" ? "success" : "Loading..."
  return (
    <tr className="text-sm">
      <td className="p-5 underline"><a className="hover:text-red-500"href={backend.url} target="_blank">backend {idx}</a></td>
      <td className="p-5">{launchText}</td>
      <td className="p-5">{convertDate(backend.hatchedAt)}</td>
      <td className="p-5">{buttonNotPresent}</td>
    </tr>
  )
}

const BackendList = ({list}: {list: BackendInfo[]}) => {
  if (list.length === 0) {
    return <p className="m-auto mt-0 p-5 bg-white rounded-xl shadow-2xl">You haven't hatched any backends yet...</p>
  }

  //add slow loading network
  
  const rows: ReactNode[] = list.map((backend, idx) => {
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

interface HatchButtonProps {
  handleClick: () => void;
  handleLoad: () => void;
  load: boolean;
}

const HatchButton = ({handleClick, handleLoad, load}: HatchButtonProps) => {
  const hatchService: React.MouseEventHandler<HTMLButtonElement> = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleClick()
    handleLoad()
  }
  return (
    <div className="flex flex-col m-auto mt-10 mb-1 relative">
        {/* <img className="h-16 w-16 red-500" src={arrow} /> */}
        <button
          // className="h-14 w-12 rounded-b-3xl border-2 border-green-500 rounded-t-3xl inset-0 bg-white bg-[radial-gradient(#ef4444_1px,transparent_4px)] [background-size:16px_16px]"
          className="bg-[#C5D0E3] h-20 w-20 rounded-full flex items-center justify-center animate-bounce"
          disabled={load}
          onClick={hatchService}
        >
          <img src={logoNoText} className="h-20 w-20 rounded-full hover:animate-spin-slow" />
        </button>
        <p className="font-josefin text-2xl text-white">Hatch a Service</p>
    </div>
  )
}

const SquishButton = () => {
  return (
    <button className="backendButton squishButton">Squish</button>
  )
}

const Loading = ({loadingState}: {loadingState: boolean}) => {
  const display: ReactElement | null = loadingState ? <Modal /> : null
  return (
    <div className="loadingText">{display}</div>
  )
}


 const BackendPage = () => {
  const user: string = '1';
  const service: string = useParams()['service'] || '';
  const [loading, isLoading] = useState<boolean>(false)

  const changeLoadState = () => {
    isLoading(true)
  }

  const [backends, setBackends] = useState<Array<BackendInfo>>([])
  const serviceName: string = useParams()['service'] || ""

  useEffect(() => {
    const getBackends = async () => {
      const { data } = await axios.get(`http://localhost:3000/1/services/${serviceName}`)
      setBackends(data);
    }
    getBackends()
  }, [serviceName])
  


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
    .catch(() => {
      //when the call to the api fails
      console.log('hatch call from frontend fail')
    })
  }
  const backendFull: string = "flex items-center ml-32 bg-slate-800 h-full"
  const backendScreen: string = "flex items-center ml-32 bg-slate-800 h-screen"
  const backendClass: string = backends.length > 11 ? backendFull : backendScreen
  

  return (
    <>
     
      <div className="h-auto flex items-center justify-center ml-32 bg-slate-800">
      <p className='flex ml-auto font-josefin text-white text-5xl align-center'>{serviceName}</p>
        <HatchButton handleClick={getUrl} handleLoad={changeLoadState} load={loading}  />
      </div>
      <div className={backendClass}>
        <BackendList list={backends} />
        <Loading loadingState={loading} />
      </div>  
    </>
    
  )
 
}

export default BackendPage