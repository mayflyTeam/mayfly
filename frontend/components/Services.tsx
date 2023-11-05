import { useState, useEffect, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

interface ServiceObject {
  id: number
  name: string
}

const Service = ({service}: {service: ServiceObject}) => {
  const { name } = service;
  return (
    <Link to={`/dash/services/${name}`}>
      <li className="p-8 border-2 font-josefin text-2xl border-black m-2 bg-white rounded-xl  shadow-2xl transform hover:bg-[#C5D0E3] duration-300 ease-in-out">
        {service.name}
      </li>
    </Link>
  )
}

const ServiceList = ({services}: {services: ServiceObject[]}) => {
  
  const list: ReactNode[] = services.map(service => <Service key={uuidv4()} service={service} />)
  return (
    <ul className="m-5">
      {list}
    </ul>
  )
}

const TableCard = () => {
  const [services, setServices] = useState<Array<ServiceObject>>([]);

  useEffect(() => {
    const userId: number = 1;

    const getServices = async () => {
      const { data } = await axios.get(`http://localhost:3000/${userId}/services`)
      setServices(data) 
    }

    getServices()
  }, [])

  return (
    <div className="flex-container object-fit justify-center ml-60 mt-40 mr-20 items-center rounded-xl w-800 shadow-3xl">
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