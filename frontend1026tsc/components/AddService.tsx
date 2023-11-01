import Sidebar from './Sidebar'
import axios from 'axios'

const Form = () => {
  const submitForm = (e) => {
    e.preventDefault;
    // make axios post call
    try {
      axios.post('http://localhost:3000/addService', {
        name: 'zach',
        image: 'test image'
      })
      .then(res => {
        console.log(res)
      })
    } catch(e) {
      console.log(e);
    }

  }


  return (
    <div className="flex justify-center text-center --translate-x-8px mr-72 mt-16 bg-white h-80 w-96">
      <form>
        <div className="text-3xl">
          Add Service
        </div>
        <div className="flex flex-col">
          <label>Docker Image: </label>
          <input className="border-4 border-black rounded" type="text" placeholder="ex:"/>
        </div>
        <div className="flex flex-col">
          <label>Name: </label>
          <input className="border-4 border-black rounded" type="text" placeholder=""/>
        </div>
        <div className=" border-t-2 border-[#C5D0E3] mt-32">
          <button type="submit" onClick={submitForm}>Add Service</button>
          <button type="submit">Cancel</button>
        </div>
      </form>
    </div>
  )
}

const AddServicePage = () => {

  return (
    <div className="flex justify-center text-center bg-slate-800 h-screen">
      <Form />
    </div>
    
  )
}

export default AddServicePage