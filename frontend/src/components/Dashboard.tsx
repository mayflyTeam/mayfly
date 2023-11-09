import { useState, useEffect, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'


const Dashboard = () => {
  return (
    <div className="flex justify-center text-center bg-slate-800 text-white h-screen">
      <div>
        <p className="mt-28 ml-28 text-3xl font-prompt">Welcome to your Mayfly Dashboard</p>
        <p className="mt-16 ml-28 text-xl font-josefin">You have X number of servers uploaded</p>
      </div>
    </div>
  )
}


export default Dashboard