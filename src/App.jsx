import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing.jsx'
import StudentRecords from './components/StudentRecords/StudentRecords.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/student-records" element={<StudentRecords />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
