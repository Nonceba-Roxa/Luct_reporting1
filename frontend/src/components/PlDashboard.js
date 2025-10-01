import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Nav, Table, Form, Button, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const PlDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [monitoring, setMonitoring] = useState({ avg_attendance: 0, report_count: 0 });
  const [ratings, setRatings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({ name: '', code: '', stream: '', description: '' });
  const [assignData, setAssignData] = useState({ course_id: '', lecturer_id: '', venue: '', scheduled_time: '', total_students: '', stream: '' });
  const [search, setSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [lecturerSearch, setLecturerSearch] = useState('');
  const [ratingSearch, setRatingSearch] = useState('');
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please log in again.');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const resCourses = await axios.get('http://localhost:5000/courses', config);
        setCourses(resCourses.data || []);
        const resClasses = await axios.get('http://localhost:5000/classes', config);
        setClasses(resClasses.data || []);
        const resReports = await axios.get(`http://localhost:5000/reports?search=${search}`, config);
        setReports(resReports.data || []);
        const resMonitoring = await axios.get('http://localhost:5000/monitoring', config);
        setMonitoring(resMonitoring.data || { avg_attendance: 0, report_count: 0 });
        const resRatings = await axios.get('http://localhost:5000/ratings', config);
        setRatings(resRatings.data || []);
        const resLecturers = await axios.get('http://localhost:5000/users/lecturers', config);
        setLecturers(resLecturers.data || []);
      } catch (err) {
        console.error('Fetch error in PlDashboard:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Error fetching data');
      }
    };
    fetchData();
  }, [search]);

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('No token found');
    if (!formData.name || !formData.code || !formData.stream) return toast.error('Please fill all course fields');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/courses', formData, config);
      toast.success('Course added');
      const resCourses = await axios.get('http://localhost:5000/courses', config);
      setCourses(resCourses.data || []);
      setFormData({ name: '', code: '', stream: '', description: '' });
    } catch (err) {
      console.error('Course submit error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error adding course');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('No token found');
    if (!assignData.course_id || !assignData.lecturer_id || !assignData.venue || !assignData.scheduled_time || !assignData.total_students || !assignData.stream) {
      return toast.error('Please fill all assignment fields');
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/assign-lecturer', assignData, config);
      toast.success('Lecturer assigned');
      const resClasses = await axios.get('http://localhost:5000/classes', config);
      setClasses(resClasses.data || []);
      setAssignData({ course_id: '', lecturer_id: '', venue: '', scheduled_time: '', total_students: '', stream: '' });
    } catch (err) {
      console.error('Assign submit error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error assigning lecturer');
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'reports.xlsx');
  };

  // Search functions
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.stream.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredClasses = classes.filter(c => 
    c.course_name.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.lecturer_name.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.venue.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.stream.toLowerCase().includes(classSearch.toLowerCase())
  );

  const filteredLecturers = lecturers.filter(l => 
    l.username.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
    (l.stream && l.stream.toLowerCase().includes(lecturerSearch.toLowerCase()))
  );

  const filteredRatings = ratings.filter(r => 
    r.comment.toLowerCase().includes(ratingSearch.toLowerCase()) ||
    r.type.toLowerCase().includes(ratingSearch.toLowerCase()) ||
    r.rating.toString().includes(ratingSearch)
  );

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dashboard-title">Program Leader Dashboard</h1>
            <p className="dashboard-subtitle">Manage courses, assignments, and faculty analytics</p>
          </div>
          <Button as={Link} to="/" variant="outline-primary" className="btn-custom">
            ← Back to Home
          </Button>
        </div>
      </div>

      <Nav variant="tabs" className="dashboard-nav" activeKey={activeTab} onSelect={setActiveTab}>
        <Nav.Item><Nav.Link eventKey="courses">Courses</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="reports">Reports</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="monitoring">Monitoring</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="classes">Classes</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="lecturers">Lecturers</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="rating">Rating</Nav.Link></Nav.Item>
      </Nav>

      <div className="dashboard-content">
        {activeTab === 'courses' && (
          <div id="courses">
            <h2 className="mb-4">Add Courses & Assign Lecturers</h2>
            
            <Card className="card-custom mb-4">
              <Card.Body>
                <h4 className="mb-3">Add New Course</h4>
                <Form onSubmit={handleCourseSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="name" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          placeholder="Enter course name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Course Code</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="code" 
                          value={formData.code} 
                          onChange={e => setFormData({...formData, code: e.target.value})} 
                          placeholder="Enter course code"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Stream</Form.Label>
                        <Form.Select 
                          className="form-control-custom"
                          name="stream" 
                          value={formData.stream} 
                          onChange={e => setFormData({...formData, stream: e.target.value})}
                        >
                          <option value="">Select Stream</option>
                          <option>Information Technology</option>
                          <option>Information System</option>
                          <option>Computer Science</option>
                          <option>Software Engineering</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="description" 
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})} 
                          placeholder="Enter course description"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" className="btn-custom">Add Course</Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className="card-custom mb-4">
              <Card.Body>
                <h4 className="mb-3">Assign Lecturer to Course</h4>
                <Form onSubmit={handleAssignSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Course</Form.Label>
                        <Form.Select 
                          className="form-control-custom"
                          name="course_id" 
                          value={assignData.course_id} 
                          onChange={e => setAssignData({...assignData, course_id: e.target.value})}
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Lecturer</Form.Label>
                        <Form.Select 
                          className="form-control-custom"
                          name="lecturer_id" 
                          value={assignData.lecturer_id} 
                          onChange={e => setAssignData({...assignData, lecturer_id: e.target.value})}
                        >
                          <option value="">Select Lecturer</option>
                          {lecturers.length > 0 ? (
                            lecturers.map(l => <option key={l.id} value={l.id}>{l.username}</option>)
                          ) : (
                            <option value="" disabled>No lecturers available</option>
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Venue</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="venue" 
                          value={assignData.venue} 
                          onChange={e => setAssignData({...assignData, venue: e.target.value})} 
                          placeholder="Enter venue"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Scheduled Time</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="scheduled_time" 
                          value={assignData.scheduled_time} 
                          onChange={e => setAssignData({...assignData, scheduled_time: e.target.value})} 
                          placeholder="e.g., Mon 9:00-11:00"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Total Students</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="total_students" 
                          type="number" 
                          value={assignData.total_students} 
                          onChange={e => setAssignData({...assignData, total_students: e.target.value})} 
                          placeholder="Enter total students"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Stream</Form.Label>
                    <Form.Select 
                      className="form-control-custom"
                      name="stream" 
                      value={assignData.stream} 
                      onChange={e => setAssignData({...assignData, stream: e.target.value})}
                    >
                      <option value="">Select Stream</option>
                      <option>Information Technology</option>
                      <option>Information System</option>
                      <option>Computer Science</option>
                      <option>Software Engineering</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" className="btn-custom">Assign Lecturer</Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Current Course Assignments</h3>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search classes by course, lecturer, venue..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Table striped bordered hover className="table-custom">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Lecturer</th>
                  <th>Stream</th>
                  <th>Venue</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map(c => (
                  <tr key={c.id}>
                    <td>{c.course_name}</td>
                    <td>{c.lecturer_name}</td>
                    <td>{c.stream}</td>
                    <td>{c.venue}</td>
                    <td>{c.scheduled_time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div id="reports">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Reports from PRLs</h2>
              <div className="d-flex gap-2">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Search reports..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form.Group>
                <Button onClick={exportToExcel} className="btn-custom">Export to Excel</Button>
              </div>
            </div>
            <Table striped bordered hover className="table-custom">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Course</th>
                  <th>Week</th>
                  <th>Feedback</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.lecturer_name}</td>
                    <td>{r.course_name}</td>
                    <td>{r.week}</td>
                    <td>{r.prl_feedback || 'No feedback yet'}</td>
                    <td>
                      <span className={`badge ${r.prl_feedback ? 'bg-success' : 'bg-warning'}`}>
                        {r.prl_feedback ? 'Reviewed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div id="monitoring">
            <h2 className="mb-4">Faculty-Wide Analytics</h2>
            <Row className="mb-4">
              <Col md={6}>
                <Card className="card-custom text-center">
                  <Card.Body>
                    <h3 className="text-gradient">{monitoring.avg_attendance}%</h3>
                    <p className="mb-0">Average Attendance</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="card-custom text-center">
                  <Card.Body>
                    <h3 className="text-gradient">{monitoring.report_count}</h3>
                    <p className="mb-0">Total Reports</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {activeTab === 'classes' && (
          <div id="classes">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Manage Classes Across Department</h2>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search classes by course, lecturer, venue..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Table striped bordered hover className="table-custom">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Lecturer</th>
                  <th>Venue</th>
                  <th>Schedule</th>
                  <th>Stream</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map(c => (
                  <tr key={c.id}>
                    <td>{c.course_name}</td>
                    <td>{c.lecturer_name}</td>
                    <td>{c.venue}</td>
                    <td>{c.scheduled_time}</td>
                    <td>{c.stream}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {activeTab === 'lecturers' && (
          <div id="lecturers">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Manage Lecturer Schedules</h2>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search lecturers by name or stream..."
                  value={lecturerSearch}
                  onChange={(e) => setLecturerSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Row>
              {filteredLecturers.map(l => (
                <Col md={6} lg={4} key={l.id} className="mb-3">
                  <Card className="card-custom h-100">
                    <Card.Body>
                      <h5 className="card-title">{l.username}</h5>
                      <p className="card-text">
                        <strong>Stream:</strong> {l.stream || 'Not assigned'}
                      </p>
                      <p className="card-text">
                        <strong>Email:</strong> {l.email || 'N/A'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {activeTab === 'rating' && (
          <div id="rating">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Overall Ratings & Feedback</h2>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search ratings..."
                  value={ratingSearch}
                  onChange={(e) => setRatingSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Row>
              {filteredRatings.map(r => (
                <Col md={6} key={r.id} className="mb-3">
                  <Card className="card-custom h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title text-capitalize">{r.type?.replace(/_/g, ' ')}</h6>
                        <span className="badge bg-primary">Rating: {r.rating}/5</span>
                      </div>
                      <p className="card-text">{r.comment}</p>
                      <small className="text-muted">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Container>
  );
};

export default PlDashboard;