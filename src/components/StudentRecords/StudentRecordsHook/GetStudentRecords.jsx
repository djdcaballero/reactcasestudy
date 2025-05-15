import React, { useEffect, useState } from 'react';
import axios from 'axios';

// StudentRecord Component
const StudentRecord = ({ student, onDelete, onUpdate }) => {
  const average =
    student.grades.reduce((sum, g) => sum + g.grade1, 0) / student.grades.length;

  return (
    <div className="student-record">
      <p>Student {student.studentId} : {student.fullName}</p>
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
        <button class="generate-btn" onClick={() => alert('Report Card Generated!')}>Generate Report Card</button>
        <button class="update-btn" onClick={() => onUpdate(student)}>Update</button>
        <button class="delete-btn" onClick={() => onDelete(student.studentId)}>Delete</button>
      </div>
    </div>
  );
};

// StudentList Component
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
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
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

const handleUpdateStudent = async (e) => {
  e.preventDefault();

  const updatedStudent = {
    ...currentStudent,
    fullName: `${currentStudent.firstName} ${currentStudent.lastName}`,
  };

  try {
    await axios.put(`https://localhost:7032/api/Students/${currentStudent.studentId}`, updatedStudent);
    setShowUpdatePopup(false);
    setCurrentStudent(null);
    fetchStudents();
  } catch (error) {
    console.error('Error updating student:', error);
  }
};

const openUpdatePopup = (student) => {
  const nameParts = student.fullName.trim().split(' ');

  let firstName = '';
  let lastName = '';

  if (nameParts.length === 2) {
    [firstName, lastName] = nameParts;
  } else if (nameParts.length >= 3) {
    firstName = nameParts[0];
    lastName = nameParts.slice(2).join(' ');
  } else {
    firstName = student.fullName;
  }

  const studentWithSplitName = {
    ...student,
    firstName,
    lastName,
  };

  setCurrentStudent(studentWithSplitName);
  setShowUpdatePopup(true);
};

  const closeUpdatePopup = () => {
    setShowUpdatePopup(false);
    setCurrentStudent(null);
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
          onUpdate={openUpdatePopup}
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

      {showUpdatePopup && currentStudent && (
        <div className="popup-container">
          <div className="popup-content">
            <h3>Update Student</h3>
            <form onSubmit={handleUpdateStudent}>
              <label>First Name:</label>
              <input
                type="text"
                value={currentStudent.firstName}
                onChange={(e) =>
                  setCurrentStudent({ ...currentStudent, firstName: e.target.value })
                }
              />

              <label>Last Name:</label>
              <input
                type="text"
                value={currentStudent.lastName}
                onChange={(e) =>
                  setCurrentStudent({ ...currentStudent, lastName: e.target.value })
                }
              />

              <h4>Grades</h4>
              {currentStudent.grades.map((grade, index) => (
                <div key={index}>
                  <label>{grade.subjectName}:</label>
                  <input
                    type="number"
                    value={grade.grade1}
                    onChange={(e) => {
                      const newGrades = [...currentStudent.grades];
                      newGrades[index].grade1 = Number(e.target.value);
                      setCurrentStudent({ ...currentStudent, grades: newGrades });
                    }}
                  />
                </div>
              ))}

              <button type="submit" className="submit">Save</button>
              <button type="button" onClick={closeUpdatePopup} className="cancel">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
