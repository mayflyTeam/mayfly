import axios from 'axios'
import { useState } from 'react';
import { Link } from 'react-router-dom'

const Form = () => {
  const [formData, setFormData] = useState({ serviceName: '', image: '', userId: 1 });

  const submitForm: React.FormEventHandler<HTMLFormElement> = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // make axios post call
    try {
      await axios.post('http://localhost:3000/addService', formData)
      location.pathname = '/services'
    } catch(e) {
      console.log(e);
    }
    reset()
  }

  const reset = () => {
    setFormData({ serviceName: '', image: '' , userId: 1})
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex font-josefin justify-center text-center --translate-x-8px mt-32 bg-white h-300 w-96 rounded-xl">
      <form onSubmit={(submitForm)}>
        <div className="mt-4 text-3xl">
          Add Service
        </div>
        <div className="flex flex-col mt-4">
          <label>Docker Image: </label>
          <input className="border-4 border-slate-900 rounded" type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="ex:"/>
        </div>
        <div className="flex flex-col mt-4">
          <label>Name: </label>
          <input className="border-4 border-slate-900 rounded" type="text" name="serviceName" value={formData.serviceName} onChange={handleInputChange} placeholder=""/>
        </div>
        <div className=" border-t-2 pt-2 border-[#C5D0E3] mt-10">
          <button className="mr-6" type="submit">Add Service</button>
          <Link to='/services'><button className="ml-6">Cancel</button></Link>
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