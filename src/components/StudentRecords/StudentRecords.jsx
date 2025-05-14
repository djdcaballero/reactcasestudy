import { useState, useEffect } from 'react';
import '../../assets/styles/StudentRecords.css';
import axios from 'axios';
import GetStudentRecords from './StudentRecordsHook/GetStudentRecords.jsx';
import Another from './StudentRecordsHook/Another.jsx';
import { useNavigate } from 'react-router-dom';


function StudentRecords() {
  const navigate = useNavigate();
  const redirectToAdd = () => navigate('/create-student');

  useEffect(() => {
    document.title = 'Student Records';
  }, []);

  return (
    <>
      <div className="main">
            <div className="content-container">
                <h1>All Student Records</h1>
                <button className="add" onClick={redirectToAdd}>+ Add</button>
                <GetStudentRecords />
            </div>
          
      </div>
    </>
  );
}

export default StudentRecords;
