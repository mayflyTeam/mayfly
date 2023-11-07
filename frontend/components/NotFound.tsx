import logoNoText from "../src/assets/transparentLogoNoText.png"

import NavHome from './NavHome'

const MayflyErrorTitle = () => {
  return (
    <div className="relative text-center text-red-900 text-center items-center mt-24">
      <img src={logoNoText} className="h-60 w-60 ml-auto mr-10 opacity-25 relative -scale-y-100" />
      <img src={logoNoText} className="h-60 w-60 mr-auto ml-10  opacity-25 relative transform -scale-x-100 -scale-y-100" />
      <p className="font-prompt absolute left-0 top-8 w-full text-8xl text-center">404</p>
      <p className="font josefin absolute top-40 w-full text-4xl">Page not found</p>
    </div>
  )
}

const HomePage = () => {
  return (
    <div className="flex justify-center text-center bg-white h-screen">
      <div className="flex-container">
        <NavHome />
        <MayflyErrorTitle />
      </div>
  </div>
  )
}


export default HomePage