import { useState, useEffect } from 'react';
import '../../assets/styles/StudentRecords.css';
import axios from 'axios';
import GetStudentRecords from './StudentRecordsHook/GetStudentRecords.jsx';
import Another from './StudentRecordsHook/Another.jsx';

function StudentRecords() {
  useEffect(() => {
    document.title = 'Student Records';
  }, []);

  return (
    <>
      <div className="main">
            <div className="content-container">
                <h1>All Student Records</h1>
                <GetStudentRecords />
            </div>
          
      </div>
    </>
  );
}

export default StudentRecords;
