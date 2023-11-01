import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

import HomePage from '../components/HomePage'
import Sidebar from '../components/Sidebar'
import ServicesPage from '../components/Services'

import AddServicePage from '../components/AddService'
import BackendPage from '../components/Backends'


const App = () => {
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
