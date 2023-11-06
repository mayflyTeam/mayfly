import logoNoText from "../src/assets/transparentLogoNoText.png"
import NavUsers from './NavUsers'
import { MouseEventHandler } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Title = () => {
  return (
    <div className="relative font-prompt text-6xl text-center text-red-900 text-center items-center mt-16">Hatch an App</div>
  )
}

const AppButton = ({text, color, handleClick}: {text: string, color: string, handleClick: MouseEventHandler}) => {

  const tailWind = `col-span-1 h-40 w-80 rounded-3xl bg-slate-700 text-4xl text-white`
  return (
    <div>
      <button onClick={handleClick} 
      className={tailWind}>{text}</button>
    </div>
  )
}

const Buttons = () => {
  const getUrl = (name: string) => {
    axios.get(`http://localhost:3000/testDemoLaunch/${name}`)
    .then(response => {
      const data = response.data
      localStorage.setItem("url", data.url)
    })
  }
  
  console.log("url from home page", localStorage.getItem('url'))
  return (
    <div className="flex relative items-center justify-center mt-16">
      
      <img src={logoNoText} className="h-60 w-60 ml-10 mb-auto opacity-25 relative transform -scale-x-100" />
      <div className="grid absolute mt-24 grid-cols-2 grid-rows-2 gap-8">
        <div>
        <Link to="/demo/app/drop4"><AppButton text={"Drop4"} handleClick={() => getUrl("Drop4")} color={"slate-500"} /></Link>
        </div>
        <div>
        <Link to="/demo/app/jupyiter-nb"> <AppButton text={"Jupyter Notebook"} handleClick={() => getUrl("jupyter-notebook")} color={"slate-500"} /></Link>
        </div>
        <div>
          <Link to="/demo/app/whiteboard"> <AppButton text={"Whiteboard"} handleClick={() => getUrl("whiteboard")} color={"slate-500"} /></Link>
        </div>
        {/* <div>
          <AppButton text={"Monopoly"} color={"red-500"} />
        </div>  */}
      </div>
      <img src={logoNoText} className="h-60 w-60 ml-auto opacity-25 relative" />
    </div>
  )
}

const DemoHomePage = () => {

  return (
    <div>
      <NavUsers />
      <Title />
      <Buttons />
    </div>
  )
}

export default DemoHomePage