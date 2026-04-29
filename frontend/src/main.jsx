import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = 'http://localhost:8080/students';
const emptyForm = { name: '', email: '', course: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => Number(a.id) - Number(b.id)),
    [students]
  );

  useEffect(() => {
    loadStudents();
  }, []);

  async function request(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async function loadStudents() {
    setLoading(true);
    setError('');
    try {
      const data = await request(API_URL);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load students. Check that Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    setMessage('');
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveStudent(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await request(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setMessage(editingId ? 'Student updated.' : 'Student created.');
      resetForm();
      await loadStudents();
    } catch (err) {
      setError('Save failed. Confirm the API and database are running.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(id) {
    setMessage('');
    setError('');
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then((response) => {
        if (!response.ok) {
          throw new Error(`Delete failed with status ${response.status}`);
        }
      });
      setMessage('Student deleted.');
      if (editingId === id) {
        resetForm();
      }
      await loadStudents();
    } catch (err) {
      setError('Delete failed. Try refreshing the list.');
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Spring Boot JDBC</p>
            <h1>Student CRUD</h1>
          </div>
          <button className="icon-button" onClick={loadStudents} disabled={loading} title="Refresh students" aria-label="Refresh students">
            R
          </button>
        </header>

        <div className="content-grid">
          <form className="editor-panel" onSubmit={saveStudent}>
            <div className="panel-heading">
              <h2>{editingId ? 'Edit Student' : 'New Student'}</h2>
              {editingId && (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>

            <label>
              Name
              <input name="name" value={form.name} onChange={updateField} placeholder="Student name" required />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="student@example.com"
                required
              />
            </label>

            <label>
              Course
              <input name="course" value={form.course} onChange={updateField} placeholder="Course name" required />
            </label>

            <button className="primary-button" type="submit" disabled={saving}>
              {editingId ? 'Update Student' : 'Create Student'}
            </button>
          </form>

          <section className="students-panel">
            <div className="panel-heading">
              <h2>Students</h2>
              <span className="count">{students.length}</span>
            </div>

            {message && (
              <div className="status success">
                {message}
              </div>
            )}
            {error && <div className="status error">{error}</div>}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td className="actions">
                        <button className="icon-button" onClick={() => startEdit(student)} title="Edit student">
                          Edit
                        </button>
                        <button className="icon-button danger" onClick={() => deleteStudent(student.id)} title="Delete student">
                          Del
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && sortedStudents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No students yet.
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        Loading students...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
