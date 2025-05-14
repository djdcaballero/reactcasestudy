import React from 'react';
import '../assets/styles/Navbar.css';

function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        <h1 className="logo">Name</h1>
        <ul className="nav-links">
          <li><a href="/create-student">Add Record</a></li>
          <li><a href="/students">Student List</a></li>
          <li><a href="/subjects">Subject List</a></li>
          <li><a href="/student-records">Student Records</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
