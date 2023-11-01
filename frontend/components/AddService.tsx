import axios from 'axios'
import { MouseEvent } from 'react';

const Form = () => {
  const submitForm: React.MouseEventHandler<HTMLButtonElement> = (e: MouseEvent<HTMLButtonElement>) => {
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
    <div className="flex font-josefin justify-center text-center --translate-x-8px mr-72 mt-16 bg-white h-300 w-96 rounded-xl">
      <form>
        <div className="mt-4 text-3xl">
          Add Service
        </div>
        <div className="flex flex-col mt-4">
          <label>Docker Image: </label>
          <input className="border-4 border-black rounded" type="text" placeholder="ex:"/>
        </div>
        <div className="flex flex-col mt-4">
          <label>Name: </label>
          <input className="border-4 border-black rounded" type="text" placeholder=""/>
        </div>
        <div className=" border-t-2 pt-2 border-[#C5D0E3] mt-10">
          <button className="mr-6" type="submit" onClick={submitForm}>Add Service</button>
          <button className="ml-6" type="submit">Cancel</button>
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