import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/styles/StudentRecords.css';

const StudentRecord = ({ student }) => {
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
      <p>Average Grade: {student.averageGrade !== null ? student.averageGrade.toFixed(2) : 'Loading...'}</p>
      <div className="button-container">
        <button>Generate Report Card</button>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentsWithAverages = async () => {
      try {
        const gradesResponse = await axios.get('https://localhost:7032/api/StudentGrades');
        const studentsWithGrades = gradesResponse.data;

        // Fetch average for each student
        const studentsWithAverages = await Promise.all(
          studentsWithGrades.map(async (student) => {
            try {
              const avgResponse = await axios.get(`https://localhost:7032/api/StudentGrades/${student.studentId}/finalgrade`);
              return {
                ...student,
                averageGrade: avgResponse.data.averageGrade
              };
            } catch (error) {
              console.error(`Error fetching average for student ${student.studentId}:`, error);
              return {
                ...student,
                averageGrade: null
              };
            }
          })
        );

        setStudents(studentsWithAverages);
      } catch (error) {
        console.error('Error fetching student grades:', error);
      }
    };

    fetchStudentsWithAverages();
  }, []);

  return (
    <div id="students-container">
      {students.map(student => (
        <StudentRecord key={student.studentId} student={student} />
      ))}
    </div>
  );
};

export default StudentList;
