import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams
} from 'react-router-dom'
import ServicesPage from './Services'
import BackendPage from './Backends'
import AddServicePage from './AddService'

import Sidebar from './Sidebar'

function Dashboard() {
  return (
      <div className="bg-slate-800 h-screen">
        <Sidebar />
          <Routes>
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:service" element={<BackendPage />} />
            <Route path="/addService" element={<AddServicePage />} />
          </Routes>
      </div>
  )
}

export default Dashboard