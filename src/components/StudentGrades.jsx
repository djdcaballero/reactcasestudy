import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentGradesList = () => {
    const [students, setStudents] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ studentId: '', name: '', grades: [] });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('https://localhost:7032/api/StudentGrades');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchStudentById = async (studentId) => {
        try {
            const response = await axios.get(`https://localhost:7032/api/StudentGrades/${studentId}/grades`); 
            setCurrentStudent(response.data);
        } catch (error) {
            console.error('Error fetching student:', error);
        }
    };

    const handleAddStudent = async (event) => {
        event.preventDefault();
        try {
            await axios.post('https://localhost:7032/api/Students', currentStudent);
            fetchStudents();
            setShowAddPopup(false);
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleUpdateStudent = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`https://localhost:7032/api/Students/${currentStudent.studentId}`, currentStudent);
            fetchStudents();
            setShowUpdatePopup(false);
        } catch (error) {
            console.error('Error updating student:', error);
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

    const openAddPopup = () => {
        setCurrentStudent({ studentId: '', name: '', grades: [] });
        setShowAddPopup(true);
    };

    const openUpdatePopup = (student) => {
        setCurrentStudent(student);
        setShowUpdatePopup(true);
    };

    const openDeletePopup = (student) => {
        setCurrentStudent(student);
        setShowDeletePopup(true);
    };

    const closeAddPopup = () => setShowAddPopup(false);
    const closeUpdatePopup = () => setShowUpdatePopup(false);
    const closeDeletePopup = () => setShowDeletePopup(false);

    return (
        <div>
            <div className="main">
                <div className="content-container">
                    <h1>STUDENT LIST</h1>
                    <label htmlFor="grade">Sort By:</label>
                    <select>
                        <option value="all">Ascending</option>
                        <option value="all">Descending</option>
                    </select>
                    <input type="text" placeholder="Search by Student ID or Student Name" />
                    <button className="search">Search</button>
                    <button className="add" onClick={openAddPopup}>+ Add</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Computed Average</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.studentId}>
                                    <td>{student.studentId}</td>
                                    <td>{student.fullName}</td>
                                    <td>{student.averageGrade}</td>
                                    <td>
                                        <button className="view" onClick={() => fetchStudentById(student.studentId)}>View</button>
                                        <button className="delete" onClick={() => openDeletePopup(student)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showAddPopup && (
                        <div id="addPopup" className="popup-container">
                            <div className="popup-content">
                                <h3>Add Student</h3>
                                <form onSubmit={handleAddStudent}>
                                    <label htmlFor="studentName">Name:</label><br />
                                    <input type="text" id="studentName" name="studentName" value={currentStudent.fullName} onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })} /><br /><br />
                                    <button type="submit" className="submit">Save</button>
                                    <button type="button" onClick={closeAddPopup} className="cancel">Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {showUpdatePopup && (
                        <div id="updatePopup" className="popup-container">
                            <div className="popup-content">
                                <h3>Update Student</h3>
                                <form onSubmit={handleUpdateStudent}>
                                    <label htmlFor="studentName">Name:</label><br />
                                    <input type="text" id="studentName" name="studentName" value={currentStudent.fullName} onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })} /><br /><br />
                                    {currentStudent.grades.map((grade, index) => (
                                        <div key={index}>
                                            <label htmlFor={`${grade.subject}Grade`}>{grade.subject}:</label><br />
                                            <input type="number" id={`${grade.subject}Grade`} name={`${grade.subject}Grade`} value={grade.grade} onChange={(e) => {
                                                const newGrades = [...currentStudent.grades];
                                                newGrades[index].grade = e.target.value;
                                                setCurrentStudent({ ...currentStudent, grades: newGrades });
                                            }} /><br /><br />
                                        </div>
                                    ))}
                                    <button type="submit" className="submit">Save</button>
                                    <button type="button" onClick={closeUpdatePopup} className="cancel">Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {showDeletePopup && (
                        <div id="deletePopup" className="popup-container">
                            <div className="popup-content">
                                <h3>Confirm Deletion</h3>
                                <p>Are you sure you want to delete this student?</p>
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
                                <p>Deleting this record will permanently remove all associated data. This action cannot be undone.</p>
                                <button id="confirmDelete" className="delete" onClick={() => handleDeleteStudent(currentStudent.studentId)}>Yes, Delete</button>
                                <button onClick={closeDeletePopup} className="cancel">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentGradesList;
