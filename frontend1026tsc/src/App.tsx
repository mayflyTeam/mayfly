import { useState, useEffect } from 'react'
import logo from "./assets/logo.png"
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useLocation
} from 'react-router-dom'
import axios from 'axios'

import HomePage from '../components/HomePage'
import Sidebar from '../components/Sidebar'
import ServicesPage from '../components/Services'

import AddServicePage from '../components/AddService'
import BackendPage from '../components/Backends'
import Dashboard from "../components/Dashboard"


function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:service" element={<BackendPage />} />
          <Route path="/addService" element={<AddServicePage />} />
        </Routes>
       
    </Router>
  )
}

export default App
