import logout from "../assets/logout.png"
import logo from "../assets/transparentLogoNoText.png"
import home from "../assets/home.png"
import computer from "../assets/computer3.png"
import { twMerge } from 'tailwind-merge'
import { Link, useLocation } from 'react-router-dom'

const nonActive: string = "font-prompt text-xl flex items-center p-4 cursor-pointer transform hover:bg-[#C5D0E3] duration-200 ease-in-out rounded-2xl"
const active: string = "flex items-center p-4 cursor-pointer bg-[#C5D0E3] rounded-2xl"

interface SideBarLinkProps {
  path: string,
  image: string,
  text: string
}

const SideBarLink = ({ path, image, text }: SideBarLinkProps) => {
  
  return (
    <div className={twMerge(nonActive, location.pathname.includes(`${path}`) ? active : '')}>
      <img src={image} className="h-5 w-5 transform hover:scale-105" />
      <span className="ml-3 ">{text}</span>
  </div>
  )
}

const Sidebar = () => {
  const location = useLocation()
  if (!location.pathname.includes("/dash")) {
    return null
  }

  return (
    <div className="fixed left-0 top-0 h-screen bg-white text-red-1000
       flex flex-col border-r-4 border-[#C5D0E3] w-52">
        <Link to="/home">
          <div className="m-3 font-prompt text-red-900 text-sm">
            <img src={logo} className="h-12 w-12 cursor-pointer transform hover:scale-105"/>
            <span className="cursor-pointer">Mayfly</span>
          </div>
        </Link>
        <div className="py-4">
          <Link to="/home">
          <SideBarLink path='home' image={home} text="Home"/>
          </Link>
          <Link to="/dashboard">
            <SideBarLink path='/dashboard' image={computer} text="Dashboard"/>
          </Link>
          <Link to="/dash/services">
            <SideBarLink path='services' image={computer} text="Services"/>
          </Link>
          <Link to="/dash/addService">
            <SideBarLink path='addService' image={computer} text="Add Service" />
          </Link>
        </div>
        <div className="mt-auto flex items-center p-4 cursor-pointer 
        transform hover:bg-[#C5D0E3] rounded-2xl">
          <img src={logout} className="h-4 w-4 transform hover:scale-105"/>
          <span className="ml-3 font-prompt text-xl transform hover:underline">Logout</span>
        </div>
      </div>

  )
}

export default Sidebar