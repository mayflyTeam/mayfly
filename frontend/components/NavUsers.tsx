import logo from "../src/assets/transparentLogoNoText.png"
import githubLogo from "../src/assets/githubLogo.png"

import { Link } from 'react-router-dom'

const NavHome = () => {
  return (
      <nav className="flex font-prompt bg-white w-screen h-24 items-center text-red-900 justify-between border-b-4 border-b-gray-900">
          <div className="m-3 text-sm">
            <a><img src={logo} className="h-12 w-12 cursor-pointer transform hover:scale-105"/></a>
            <span className="pr-1 cursor-pointer">Mayfly</span>
          </div>
          <ul className="flex mr-auto text-xl">
            <Link to="/home"><li className="m-2 hover:underline hover:text-red-500 cursor-pointer">Home</li></Link>
            <Link to="/demo/apps"><li className="m-2 underline text-red-700 cursor-pointer">Demo</li></Link>
            {/* <li className="m-2 hover:underline hover:text-red-500 cursor-pointer">Case Study</li> */}
          </ul>
          <a><img src={githubLogo} className="h-12 w-12 m-2 cursor-pointer transform hover:scale-105"/></a>
        </nav>
  )
}

export default NavHome