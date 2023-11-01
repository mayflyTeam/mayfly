import logo from "../src/assets/fullTransparentLogo.png"
import logoNoText from "../src/assets/modernLogo.png"
import githubLogo from "../src/assets/githubLogo.png"

import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const NavHome: React.FC = () => {
  return (
        
        <nav className="flex font-amatic text-2xl bg-white w-screen h-24 items-center text-red-900 justify-between border-b-4 border-b-gray-900">
          <a><img src={logo} className="h-24 w-24 m-4 cursor-pointer  transform hover:scale-105"/></a>
          <ul className="flex mr-auto">
            <li className="m-2 hover:underline hover:text-red-500 cursor-pointer">Home</li>
            <Link to="/services"><li className="m-2 hover:underline hover:text-red-500 cursor-pointer">Services</li></Link>
            <li className="m-2 hover:underline hover:text-red-500 cursor-pointer">Logout</li>
          </ul>
          <a><img src={githubLogo} className="h-16 w-16 m-2 cursor-pointer transform hover:scale-105"/></a>
        </nav>
  )
}

const AnimatedText: React.FC = () => {
  const words = ['high compute', 'collaborative', 'gaming'];
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentIndex = words.indexOf(currentWord);
      const nextIndex = (currentIndex + 1) % words.length;
      setCurrentWord(words[nextIndex]);
    }, 1750);

    return () => clearInterval(intervalId)
  }, [currentWord, words]);

  return (
    <p className="absolute font-josefin left-0 top-40 w-full text-2xl text-center">An open source tool for hosting <span className="text-red-500 text-2xl">{currentWord}</span> apps in the browser</p>
  )
}

const MayflyTitle: React.FC = () => {
  return (
    <div className="relative text-center text-red-900 text-center items-center mt-24">
      <img src={logoNoText} className="h-60 w-60 ml-auto opacity-25 relative" />
      <img src={logoNoText} className="h-60 w-60 mr-auto opacity-25 relative transform -scale-x-100" />
      <p className="font-amatic absolute left-0 top-8 w-full text-9xl text-center">MAYFLY</p>
      <AnimatedText />
      <button className="absolute top-64 left-1/2 -translate-x-1/2 font-josefin text-3xl text-center px-10 py-5 bg-red-400 border-2 border-red-900 rounded-3xl shadow-2xl transform hover:bg-red-500 hover:text-white ease-in-out duration-300">Get Started</button>
    </div>
  )
}

const HomePage: React.FC = () => {
  return (
    <div className="flex justify-center text-center bg-white h-screen">
      <div className="flex-container">
        <NavHome />
        <MayflyTitle />
      </div>
  </div>
  )
}


export default HomePage