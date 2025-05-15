import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentGradesList = () => {
    const [students, setStudents] = useState([]);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({
        studentId: '',
        firstName: '',
        lastName: '',
        middleInitial: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        email: '',
        phoneNumber: '',
        active: true,
        modifiedDate: '',
        grades: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('https://localhost:7032/api/StudentGrades');
            const studentsData = response.data;

            const studentsWithGrades = await Promise.all(studentsData.map(async (student) => {
                const gradeResponse = await axios.get(`https://localhost:7032/api/StudentGrades/${student.studentId}/finalgrade`);
                return { ...student, averageGrade: gradeResponse.data.averageGrade };
            }));

            setStudents(studentsWithGrades);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchStudentById = async (studentId) => {
        try {
            const gradesResponse = await axios.get(`https://localhost:7032/api/StudentGrades/${studentId}/grades`);
            const gradesData = gradesResponse.data;

            const studentResponse = await axios.get(`https://localhost:7032/api/Students/${studentId}`);
            const studentDetails = studentResponse.data;

            const mergedStudent = {
                ...studentDetails,
                grades: gradesData.grades || []
            };

            setCurrentStudent(mergedStudent);
        } catch (error) {
            console.error('Error fetching student:', error);
        }
    };


    const handleUpdateStudent = async (event) => {
        event.preventDefault();

        const cleanedStudent = {
            ...currentStudent,
            grades: currentStudent.grades.map(g => ({
                gradeId: g.gradeId,
                studentId: g.studentId,
                subjectId: g.subjectId,
                grade1: g.grade1,
                modifiedDate: g.modifiedDate
            }))
        };

        console.log('Sending cleaned student:', JSON.stringify(cleanedStudent, null, 2));

        try {
            const response = await axios.put(
                `https://localhost:7032/api/Students/${currentStudent.studentId}`,
                cleanedStudent
            );
            console.log('Update response:', response.data);
            fetchStudents();
            setShowUpdatePopup(false);
        } catch (error) {
            console.error('Update failed:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        }
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await axios.delete(`https://localhost:7032/api/Students/${studentId}`);
            fetchStudents();
            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const openAddPopup = () => navigate('/create-student');

    const openUpdatePopup = async (student) => {
        await fetchStudentById(student.studentId);
        setShowUpdatePopup(true);
    };

    const openDeletePopup = (student) => {
        setCurrentStudent(student);
        setShowDeletePopup(true);
    };

    const closeUpdatePopup = () => setShowUpdatePopup(false);
    const closeDeletePopup = () => setShowDeletePopup(false);

    return (
        <div className="main">
            <div className="content-container">
                <h1>STUDENT LIST</h1>
                <button className="add" onClick={openAddPopup}>+ Add</button>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Full Name</th>
                            <th>Average Grade</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.studentId}>
                                <td>{student.studentId}</td>
                                <td>{student.fullName}</td>
                                <td>{student.averageGrade}</td>
                                <td>{student.address || 'N/A'}</td>
                                <td>{student.email || 'N/A'}</td>
                                <td>{student.phoneNumber || 'N/A'}</td>
                                <td>
                                    <button className="update" onClick={() => openUpdatePopup(student)}>Update</button>
                                    <button className="delete" onClick={() => openDeletePopup(student)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {showUpdatePopup && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <h3>Update Student</h3>
                            <form onSubmit={handleUpdateStudent}>
                                <label>First Name:</label>
                                <input type="text" value={currentStudent.firstName} onChange={(e) => setCurrentStudent({ ...currentStudent, firstName: e.target.value })} />

                                <label>Last Name:</label>
                                <input type="text" value={currentStudent.lastName} onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })} />
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

                {showDeletePopup && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <h3>Confirm Deletion</h3>
                            <p>Are you sure you want to delete <strong>{currentStudent.fullName}</strong>?</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Computed Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{currentStudent.studentId}</td>
                                        <td>{currentStudent.fullName}</td>
                                        <td>{currentStudent.averageGrade}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>This action cannot be undone.</p>
                            <button className="delete" onClick={() => handleDeleteStudent(currentStudent.studentId)}>Yes, Delete</button>
                            <button className="cancel" onClick={closeDeletePopup}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentGradesList;
