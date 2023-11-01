import Sidebar from './Sidebar'
import { useState, useEffect} from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams
} from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

interface ServiceObject {
  id: number
  name: string
}

const Service = ({service}: {service: ServiceObject}) => {
  const serviceName: string = service.name
  return (
    <Link to={`/services/${serviceName}`}>
      <li className="p-8 border-2 border-black m-2 bg-white rounded-xl  shadow-2xl transform hover:bg-[#C5D0E3] duration-300 ease-in-out">
        {service.name}
      </li>
    </Link>
  )
}

const ServiceList = ({services}: {services: ServiceObject[]}) => {
  
  const list = services.map(service => <Service key={uuidv4()} service={service} />)
  return (
    <ul className="m-5">
      {list}
    </ul>
  )
}

const TableCard = () => {

  const [services, setServices] = useState<Array<ServiceObject>>([]);

  useEffect(() => {
    const userId = 1;

    const getServices = async () => {
      const { data } = await axios.get(`http://localhost:3000/${userId}/services`)
      setServices(data) 
    }

    getServices()
  }, [])

  return (
    <div className="flex-container object-fit justify-center items-center rounded-xl mt-60 w-screen mr-20 ml-60 shadow-3xl">
      <ServiceList services={services}/>
    </div>
  )
}

const ServicesPage = () => {
  return (
    <div className="flex justify-center text-center bg-slate-800 h-screen">
      <TableCard />
    </div>
  )
}


export default ServicesPage