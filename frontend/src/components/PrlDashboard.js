import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Nav, Table, Form, Button, ListGroup, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const PrlDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [monitoring, setMonitoring] = useState({ avg_attendance: 0, report_count: 0 });
  const [ratings, setRatings] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedReportId, setSelectedReportId] = useState('');
  const [search, setSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
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
      } catch (err) {
        console.error('Fetch error in PrlDashboard:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Error fetching data');
      }
    };
    fetchData();
  }, [search]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('No token found');
    if (!feedback.trim()) return toast.error('Please enter feedback');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/reports/${selectedReportId}/feedback`, { feedback }, config);
      toast.success('Feedback added successfully');
      setFeedback('');
      setSelectedReportId('');
      const resReports = await axios.get(`http://localhost:5000/reports?search=${search}`, config);
      setReports(resReports.data || []);
    } catch (err) {
      console.error('Feedback submit error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error adding feedback');
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
            <h1 className="dashboard-title">PRL Dashboard</h1>
            <p className="dashboard-subtitle">Review lecturer reports and provide feedback</p>
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
        <Nav.Item><Nav.Link eventKey="rating">Rating</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="classes">Classes</Nav.Link></Nav.Item>
      </Nav>

      <div className="dashboard-content">
        {activeTab === 'courses' && (
          <div id="courses">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Courses Under Your Stream</h2>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search courses by name, code, or stream..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Row>
              {filteredCourses.map(c => {
                const pendingReports = reports.filter(r => r.course_name === c.name && r.status === 'pending');
                return (
                  <Col md={6} lg={4} key={c.id} className="mb-3">
                    <Card className={`card-custom h-100 ${pendingReports.length > 0 ? 'border-warning' : ''}`}>
                      <Card.Body>
                        <h5 className="card-title">{c.name}</h5>
                        <p className="card-text">
                          <strong>Code:</strong> {c.code}
                        </p>
                        <p className="card-text">
                          <strong>Stream:</strong> {c.stream}
                        </p>
                        <div className={`badge ${pendingReports.length > 0 ? 'bg-warning' : 'bg-success'}`}>
                          {pendingReports.length > 0 ? `${pendingReports.length} Pending` : 'Reviewed'}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}

        {activeTab === 'reports' && (
          <div id="reports">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Lecturer Reports</h2>
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

            <Table striped bordered hover className="table-custom mb-4">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Course</th>
                  <th>Week</th>
                  <th>Topic</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.lecturer_name}</td>
                    <td>{r.course_name}</td>
                    <td>{r.week}</td>
                    <td>{r.topic}</td>
                    <td>{r.present_students}/{r.total_students}</td>
                    <td>
                      <span className={`badge ${r.status === 'reviewed' ? 'bg-success' : 'bg-warning'}`}>
                        {r.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <Button 
                        size="sm" 
                        className="btn-custom"
                        onClick={() => setSelectedReportId(r.id)}
                      >
                        Add Feedback
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {selectedReportId && (
              <Card className="card-custom">
                <Card.Body>
                  <h5 className="mb-3">Add Feedback for Selected Report</h5>
                  <Form onSubmit={handleFeedbackSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Feedback</Form.Label>
                      <Form.Control 
                        className="form-control-custom"
                        as="textarea" 
                        rows={4}
                        value={feedback} 
                        onChange={e => setFeedback(e.target.value)} 
                        placeholder="Enter your feedback for this report..."
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Button type="submit" className="btn-custom">Submit Feedback</Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          setSelectedReportId('');
                          setFeedback('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            <h3 className="mt-4 mb-3">Feedback History</h3>
            <ListGroup>
              {reports.filter(r => r.prl_feedback).map(r => (
                <ListGroup.Item key={r.id} className="card-custom mb-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{r.course_name}</strong> - Week {r.week}
                      <p className="mb-0 mt-1">{r.prl_feedback}</p>
                    </div>
                    <small className="text-muted">{r.lecturer_name}</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div id="monitoring">
            <h2 className="mb-4">Attendance and Reporting Trends</h2>
            <Row>
              <Col md={6}>
                <Card className="card-custom text-center">
                  <Card.Body>
                    <h3 className="text-gradient">{monitoring.avg_attendance}%</h3>
                    <p className="mb-0">Average Attendance Rate</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="card-custom text-center">
                  <Card.Body>
                    <h3 className="text-gradient">{monitoring.report_count}</h3>
                    <p className="mb-0">Total Reports Submitted</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {activeTab === 'rating' && (
          <div id="rating">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Teaching Quality & Resource Feedback</h2>
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
                        <h6 className="card-title text-capitalize">
                          {r.type?.replace(/_/g, ' ') || 'General Rating'}
                        </h6>
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

        {activeTab === 'classes' && (
          <div id="classes">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Assigned Classes and Teaching Allocations</h2>
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
      </div>
    </Container>
  );
};

export default PrlDashboard;