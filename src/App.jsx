import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing.jsx'
import StudentRecords from './components/StudentRecords/StudentRecords.jsx'
import Subjects from './Subjects.jsx'
import Navbar from './components/Navbar.jsx'
import AddStudents from './components/AddStudents/AddStudents.jsx'
import Students from './components/StudentGrades.jsx'
import Footer from './components/Footer.jsx';
import NotFoundPage from './components/NotFoundPage.jsx'

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
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/create-student" element={<AddStudents />} />
          <Route path="/students" element={<Students />} />
          <Route path="*" element={<NotFoundPage />} />"
        </Routes>
        <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
