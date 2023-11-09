import logoNoText from "../assets/transparentLogoNoText.png"

import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import NavHome from './NavHome'


const AnimatedText = () => {
  const words: string[] = useMemo(() => ['high compute', 'collaborative', 'stateful'], []);
  const [currentWord, setCurrentWord] = useState<string>(words[0]);

  useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      const currentIndex = words.indexOf(currentWord);
      const nextIndex = (currentIndex + 1) % words.length;
      setCurrentWord(words[nextIndex]);
    }, 2000);

    return () => clearInterval(intervalId)
  }, [currentWord, words]);

  return (
    <p className="absolute font-josefin left-0 top-40 w-full text-2xl text-center">An open source tool for hosting <span className="text-red-500 font-bold text-2xl">{currentWord}</span> apps in the browser</p>
  )
}

// const Button = ({text, color, hoverColor}: {text:string, color:string, hoverColor: string}) => {
  

//   <button className="absolute top-64 left-1/2 -translate-x-1/2 font-josefin text-3xl text-center px-10 py-5 bg-red-400 border-2 border-red-900 rounded-3xl shadow-2xl transform hover:bg-red-500 hover:text-white ease-in-out duration-300">
//         Get Started
//         ({text})
//       </button>
// }

const MayflyTitle = () => {
  return (
    <div className="relative text-center text-red-900 text-center items-center mt-24">
    <img src={logoNoText} className="h-60 w-60 ml-auto mr-10 opacity-25 relative" />
    <img src={logoNoText} className="h-60 w-60 mr-auto ml-10  opacity-25 relative transform -scale-x-100" />
    <p className="font-prompt absolute left-0 top-8 w-full text-8xl text-center">Mayfly</p>
    <AnimatedText />
    <Link to="/demo/apps">
      <button className="absolute top-64 left-1/2 -translate-x-1/2 font-josefin text-2xl text-center px-10 py-5 bg-red-400 border-2 border-red-900 rounded-3xl shadow-2xl transform hover:bg-red-500 hover:text-white ease-in-out duration-300">
        Get Started
        (User)
      </button>
    </Link>
    <Link to="/dashboard">
      <button className="absolute top-96 left-1/2 -translate-x-1/2 font-josefin text-2xl text-center px-10 py-5 bg-slate-800 border-2 border-white rounded-3xl shadow-2xl text-white transform hover:bg-slate-600 hover:text-white ease-in-out duration-300">
        Get Started
        (Devs)
      </button>
    </Link>
      
   
  </div>
)
}

const HomePage = () => {
  return (
    <div className="flex justify-center text-center bg-white h-screen">
      <div className="flex-container">
        <NavHome />
        <MayflyTitle />
        <h2 className="font-josefin text-red-900 text-3xl mt-8 mb-2">What are Session Backends?</h2>
        <p className="font-josefin mx-40 mb-40 p-8 border-2 border-red-900 text-xl text-red-900 rounded-2xl leading-10">
        Session backends are container instances running on virtual servers in the cloud, allowing the backend to manage state and computational power. Session backends are dedicated processes created for each user session of an application. Each user can share access to their session with their friends and/or coworkers, providing a collaborative session of a high compute, stateful application. Within minutes of all users exiting the session the session backend will spin down, freeing up resources for future sessions.
        </p>
      </div>
  </div>
  )
}


export default HomePage