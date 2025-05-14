import { useState, useEffect } from 'react';
import '../../assets/styles/addStudents.css';
import GetSubjects from './AddStudentsHook/GetSubjects.jsx';
import axios from 'axios';

function AddStudents() {
	const [subjectRows, setSubjectRows] = useState([{ subjectId: '', grade: '' }]);
	const [studentInfo, setStudentInfo] = useState({
		firstName: '',
		middleName: '',
		lastName: ''
	});
	const [allSubjects, setAllSubjects] = useState([]);

	useEffect(() => {
		document.title = 'Add Student Record';
		axios.get('https://localhost:7032/api/Subjects')
		.then(response => setAllSubjects(response.data))
		.catch(error => console.error('Error fetching subjects:', error));
	}, []);


	const handleStudentChange = (e) => {
		const { name, value } = e.target;
		setStudentInfo(prev => ({ ...prev, [name]: value }));
	};

	const removeSubjectRow = (indexToRemove) => {
		setSubjectRows(prevRows => prevRows.filter((_, index) => index !== indexToRemove));
	};


	const handleSubjectChange = (index, field, value) => {
		const updatedRows = [...subjectRows];
		updatedRows[index][field] = value;
		setSubjectRows(updatedRows);
	};

	const addSubjectRow = () => {
		setSubjectRows([...subjectRows, { subjectId: '', grade: '' }]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const grades = subjectRows.map(row => ({
			subjectId: parseInt(row.subjectId),
			grade1: parseFloat(row.grade),
			modifiedDate: new Date().toISOString().split('T')[0]
		}));

	const studentData = {
		...studentInfo,
		middleName: studentInfo.middleName?.[0] || null,
		active: true,
		modifiedDate: new Date().toISOString().split('T')[0],
		grades
	};

		try {
			await axios.post('https://localhost:7032/api/Students', studentData);
			alert('Student and grades added successfully!');
		} catch (error) {
			console.error('Error:', error);
			alert('Failed to add student and grades.');
		}
	};

	const selectedSubjectIds = subjectRows.map(row => row.subjectId);

	return (
	<>
	<div className="main">
		<div className="content-container">
		<h1>Student Record System</h1>
			<div id="add-student-form-container">
				<form id="add-student-form" onSubmit={handleSubmit}>
					<label htmlFor="first-name">First Name:</label>
					<input type="text" id="first-name" name="firstName" value={studentInfo.firstName} onChange={handleStudentChange} required /><br /><br />
					<label htmlFor="middle-name">Middle Name:</label>
					<input type="text" id="middle-name" name="middleName" value={studentInfo.middleName} onChange={handleStudentChange} required /><br /><br />
					<label htmlFor="last-name">Last Name:</label>
					<input type="text" id="last-name" name="lastName" value={studentInfo.lastName} onChange={handleStudentChange} required /><br /><br />

					{subjectRows.map((row, index) => (
						<div className="subject-grade-row" key={index}>
							<GetSubjects
							id={`subject-${index}`}
							value={row.subjectId}
							onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
							selectedSubjects={selectedSubjectIds.filter((_, i) => i !== index)}
							/>
							<div className="form-group">
								<label htmlFor={`grade-${index}`}>Grade:</label>
								<input
								type="number"
								id={`grade-${index}`}
								name={`grade-${index}`}
								value={row.grade}
								onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
								required
								/>
							</div>
							{subjectRows.length > 1 && (
								<button
								type="button"
								onClick={() => removeSubjectRow(index)}
								className="remove-btn"
								>
								Remove
								</button>
							)}
						</div>
					))}

					<button
					type="button"
					onClick={addSubjectRow}
					disabled={subjectRows.length >= allSubjects.length}
					>
					Add Subject
					</button>

					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	</div>
	</>
	);
}

export default AddStudents;
