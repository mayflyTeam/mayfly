import NavUsers from './NavUsers'
import logoNoText from "../assets/transparentLogoNoText.png"

const DemoAppPage = () => {
  const url = localStorage.getItem("url") || ''
  console.log("url:", url)
  return (
    <div>
      <NavUsers />
      <img src={logoNoText} className="h-60 w-60 m-auto mr-20 mt-40 opacity-25 relative transform -scale-x-100" />
      <a href={url} target="_blank">
        <button className="absolute top-64 left-1/2 -translate-x-1/2 font-josefin text-3xl text-center px-10 py-5 bg-red-400 border-2 border-red-900 rounded-3xl shadow-2xl transform hover:bg-red-500 hover:text-white ease-in-out duration-300">
          Get Started
        </button>
      </a>
      <img src={logoNoText} className="h-60 w-60 ml-20 mb-20 opacity-25 relative" />
    </div>

    
  );
}


export default DemoAppPage