import { useState, useEffect } from 'react';
import axios from 'axios';

function GetSubjects({ id, value, onChange, selectedSubjects = [] }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7032/api/Subjects')
      .then(response => setSubjects(response.data))
      .catch(error => console.error('Error fetching subjects:', error));
  }, []);

  const filteredSubjects = subjects.filter(
    subject => !selectedSubjects.includes(subject.subjectId.toString())
  );

  return (
    <div className="form-group">
      <label htmlFor={id}>Subject</label>
      <select id={id} name={id} value={value} required onChange={onChange}>
        <option value="">Select Subject</option>
        {filteredSubjects.map(subject => (
          <option key={subject.subjectId} value={subject.subjectId}>
            {subject.subjectName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GetSubjects;
