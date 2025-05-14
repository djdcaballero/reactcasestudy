import React, { useEffect, useState } from 'react';
import axios from 'axios';

// StudentRecord Component
const StudentRecord = ({ student, onDelete }) => {
  const average =
    student.grades.reduce((sum, g) => sum + g.grade1, 0) / student.grades.length;

  return (
    <div className="student-record">
      <p>Student {student.studentId} : {student.fullName}</p>
      <div className="student-info">
        <button onClick={() => onDelete(student.studentId)}>Delete</button>
        <button>Update</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {student.grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.subjectName}</td>
              <td>{grade.grade1.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Average Grade: {average.toFixed(2)}</p>
      <div className="button-container">
        <button onClick={() => alert('Report Card Generated!')}>Generate Report Card</button>
      </div>
    </div>
  );
};

// StudentList Component
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 1;

  const fetchStudents = () => {
    axios.get('https://localhost:7032/api/StudentGrades')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://localhost:7032/api/Students/${studentId}`);
      fetchStudents(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  return (
    <div id="students-container">
      {currentStudents.map(student => (
        <StudentRecord
          key={student.studentId}
          student={student}
          onDelete={handleDeleteStudent}
        />
      ))}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span> Page {currentPage} of {totalPages} </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentList;
