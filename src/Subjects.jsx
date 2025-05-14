import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/styles/SubjectList.css';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentSubject, setCurrentSubject] = useState({ subjectId: '', subjectName: '' });

    const [currentPage, setCurrentPage] = useState(1);
    const subjectsPerPage = 5;

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('https://localhost:7032/api/Subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleAddSubject = async (event) => {
        event.preventDefault();
        try {
            const payload = { subjectName: currentSubject.subjectName };
            await axios.post('https://localhost:7032/api/Subjects', payload);
            await fetchSubjects();
            setShowAddPopup(false);
        } catch (error) {
            console.error('Error adding subject:', error);
        }
    };

    const handleUpdateSubject = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`https://localhost:7032/api/Subjects/${currentSubject.subjectId}`, currentSubject);
            fetchSubjects();
            setShowUpdatePopup(false);
        } catch (error) {
            console.error('Error updating subject:', error);
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        try {
            await axios.delete(`https://localhost:7032/api/Subjects/${subjectId}`);
            fetchSubjects();
            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const openAddPopup = () => {
        setCurrentSubject({ subjectId: '', subjectName: '' });
        setShowAddPopup(true);
    };

    const openUpdatePopup = (subject) => {
        setCurrentSubject(subject);
        setShowUpdatePopup(true);
    };

    const openDeletePopup = (subject) => {
        setCurrentSubject(subject);
        setShowDeletePopup(true);
    };

    const closeAddPopup = () => setShowAddPopup(false);
    const closeUpdatePopup = () => setShowUpdatePopup(false);
    const closeDeletePopup = () => setShowDeletePopup(false);

    // Pagination logic
    const indexOfLastSubject = currentPage * subjectsPerPage;
    const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
    const currentSubjects = subjects.slice(indexOfFirstSubject, indexOfLastSubject);
    const totalPages = Math.ceil(subjects.length / subjectsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <div className="main">
                <div className="content-container">
                    <h1>Subject List</h1>
                    <button onClick={openAddPopup}>+ Add</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Subject ID</th>
                                <th>Subject Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSubjects.map(subject => (
                                <tr key={subject.subjectId}>
                                    <td>{subject.subjectId}</td>
                                    <td>{subject.subjectName}</td>
                                    <td>
                                        <button onClick={() => openUpdatePopup(subject)}>Update</button>
                                        <button onClick={() => openDeletePopup(subject)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Add Popup */}
                    {showAddPopup && (
                        <div className="popup-container">
                            <div className="popup-content">
                                <h3>Add Subject</h3>
                                <form onSubmit={handleAddSubject}>
                                    <label htmlFor="subjectName">Subject Name:</label><br />
                                    <input
                                        type="text"
                                        id="subjectName"
                                        name="subjectName"
                                        value={currentSubject.subjectName}
                                        onChange={(e) => setCurrentSubject({ ...currentSubject, subjectName: e.target.value })}
                                    /><br /><br />
                                    <button type="submit">Add</button>
                                    <button type="button" onClick={closeAddPopup}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Update Popup */}
                    {showUpdatePopup && (
                        <div className="popup-container">
                            <div className="popup-content">
                                <h3>Update Subject</h3>
                                <form onSubmit={handleUpdateSubject}>
                                    <label htmlFor="subjectName">Subject Name:</label><br />
                                    <input
                                        type="text"
                                        id="subjectName"
                                        name="subjectName"
                                        value={currentSubject.subjectName}
                                        onChange={(e) => setCurrentSubject({ ...currentSubject, subjectName: e.target.value })}
                                    /><br /><br />
                                    <button type="submit">Update</button>
                                    <button type="button" onClick={closeUpdatePopup}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Popup */}
                    {showDeletePopup && (
                        <div className="popup-container">
                            <div className="popup-content">
                                <h3>Confirm Deletion</h3>
                                <p>Are you sure you want to delete this subject?</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Subject ID</th>
                                            <th>Subject Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{currentSubject.subjectId}</td>
                                            <td>{currentSubject.subjectName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button onClick={() => handleDeleteSubject(currentSubject.subjectId)}>Yes, Delete</button>
                                <button onClick={closeDeletePopup}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectList;
