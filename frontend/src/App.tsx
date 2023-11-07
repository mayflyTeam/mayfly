import {
  BrowserRouter as Router,
  Routes, Route, Navigate
} from 'react-router-dom'

import HomePage from '../components/HomePage'
import NotFound from '../components/NotFound'
import Sidebar from '../components/Sidebar'
import ServicesPage from '../components/Services'
import Dashboard from '../components/Dashboard'
import AddServicePage from '../components/AddService'
import BackendPage from '../components/Backends'

import DemoHomePage from '../components/DemoHomePage'
import DemoAppPage from '../components/DemoAppPage'


const App = () => {
  return (

    <div>
      <h1>Mayfly</h1>
    </div>
    // <Router>
    //   <Sidebar />
    //   <Routes>
    //       <Route path="/home" element={<HomePage />} />
    //       <Route path="/dashboard" element={<Dashboard />} />
    //       <Route path="/dash/services" element={<ServicesPage />} />
    //       <Route path="/dash/services/:service" element={<BackendPage />} />
    //       <Route path="/dash/addService" element={<AddServicePage />} />
    //       <Route path="/demo/apps" element={<DemoHomePage />} />
    //       <Route path="demo/app/:app" element={<DemoAppPage />} />
    //       <Route path="/" element={<Navigate to="/home" />} />
    //       <Route path="*" element={<NotFound />} />
          
    //     </Routes>
       
    // </Router>
  )
}

export default App
