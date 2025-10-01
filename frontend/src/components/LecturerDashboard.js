import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Nav, Table, Form, Button, ListGroup, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

const LecturerDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [reports, setReports] = useState([]);
  const [monitoring, setMonitoring] = useState({ avg_attendance: 0, report_count: 0 });
  const [ratings, setRatings] = useState([]);
  const [formData, setFormData] = useState({ 
    class_id: '', week: '', date: '', topic: '', learning_outcomes: '', 
    present_students: '', total_students: '', venue: '', scheduled_time: '', recommendations: '' 
  });
  const [facilityRating, setFacilityRating] = useState(1);
  const [facilityComment, setFacilityComment] = useState('');
  const [search, setSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [ratingSearch, setRatingSearch] = useState('');
  const [activeTab, setActiveTab] = useState('classes');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please log in again.');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const resClasses = await axios.get('http://localhost:5000/classes', config);
        setClasses(resClasses.data || []);
        const resReports = await axios.get(`http://localhost:5000/reports?search=${search}`, config);
        setReports(resReports.data || []);
        const resMonitoring = await axios.get('http://localhost:5000/monitoring', config);
        setMonitoring(resMonitoring.data || { avg_attendance: 0, report_count: 0 });
        const resRatings = await axios.get('http://localhost:5000/ratings', config);
        setRatings(resRatings.data || []);
      } catch (err) {
        console.error('Fetch error in LecturerDashboard:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || 'Error fetching data');
      }
    };
    fetchData();
  }, [search]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('No token found');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/reports', formData, config);
      toast.success('Report submitted successfully');
      setFormData({ 
        class_id: '', week: '', date: '', topic: '', learning_outcomes: '', 
        present_students: '', total_students: '', venue: '', scheduled_time: '', recommendations: '' 
      });
      const resReports = await axios.get(`http://localhost:5000/reports?search=${search}`, config);
      setReports(resReports.data || []);
    } catch (err) {
      console.error('Report submit error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error submitting report');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return toast.error('No token found');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.post('http://localhost:5000/ratings', { 
        ratee_id: null, 
        rating: facilityRating, 
        comment: facilityComment, 
        type: 'lecturer_to_facilities' 
      }, config);
      toast.success('Rating submitted successfully');
      setFacilityRating(1);
      setFacilityComment('');
      const resRatings = await axios.get('http://localhost:5000/ratings', config);
      setRatings(resRatings.data || []);
    } catch (err) {
      console.error('Rating submit error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Error submitting rating');
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reports);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'reports.xlsx');
  };

  // Search functions
  const filteredClasses = classes.filter(c => 
    c.course_name.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.venue.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.stream.toLowerCase().includes(classSearch.toLowerCase())
  );

  const filteredStudentRatings = ratings
    .filter(r => r.type === 'student_to_lecturer')
    .filter(r => 
      r.comment.toLowerCase().includes(ratingSearch.toLowerCase()) ||
      r.rating.toString().includes(ratingSearch)
    );

  const filteredFacilityRatings = ratings
    .filter(r => r.type === 'lecturer_to_facilities')
    .filter(r => 
      r.comment.toLowerCase().includes(ratingSearch.toLowerCase()) ||
      r.rating.toString().includes(ratingSearch)
    );

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dashboard-title">Lecturer Dashboard</h1>
            <p className="dashboard-subtitle">Manage your classes and submit teaching reports</p>
          </div>
          <Button as={Link} to="/" variant="outline-primary" className="btn-custom">
            ← Back to Home
          </Button>
        </div>
      </div>

      <Nav variant="tabs" className="dashboard-nav" activeKey={activeTab} onSelect={setActiveTab}>
        <Nav.Item><Nav.Link eventKey="classes">Classes</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="reports">Reports</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="monitoring">Monitoring</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="rating">Rating</Nav.Link></Nav.Item>
      </Nav>

      <div className="dashboard-content">
        {activeTab === 'classes' && (
          <div id="classes">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Your Assigned Classes</h2>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search classes by course, venue, or stream..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Table striped bordered hover className="table-custom">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Venue</th>
                  <th>Schedule</th>
                  <th>Total Students</th>
                  <th>Stream</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map(c => (
                  <tr key={c.id}>
                    <td>{c.course_name}</td>
                    <td>{c.venue}</td>
                    <td>{c.scheduled_time}</td>
                    <td>{c.total_students}</td>
                    <td>{c.stream}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div id="reports">
            <h2 className="mb-4">Submit Teaching Report</h2>
            
            <Card className="card-custom mb-4">
              <Card.Body>
                <Form onSubmit={handleReportSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Class</Form.Label>
                        <Form.Select 
                          className="form-control-custom"
                          name="class_id" 
                          value={formData.class_id} 
                          onChange={handleChange}
                        >
                          <option value="">Select Class</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.course_name} - {c.venue}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Week</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="week" 
                          value={formData.week} 
                          onChange={handleChange}
                          placeholder="Week number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          type="date" 
                          name="date" 
                          value={formData.date} 
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Topic Covered</Form.Label>
                    <Form.Control 
                      className="form-control-custom"
                      name="topic" 
                      value={formData.topic} 
                      onChange={handleChange}
                      placeholder="Enter topic covered"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Learning Outcomes</Form.Label>
                    <Form.Control 
                      className="form-control-custom"
                      as="textarea"
                      rows={3}
                      name="learning_outcomes" 
                      value={formData.learning_outcomes} 
                      onChange={handleChange}
                      placeholder="Describe learning outcomes achieved"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Present Students</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          type="number"
                          name="present_students" 
                          value={formData.present_students} 
                          onChange={handleChange}
                          placeholder="Number present"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Total Students</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          type="number"
                          name="total_students" 
                          value={formData.total_students} 
                          onChange={handleChange}
                          placeholder="Total enrolled"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Venue</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="venue" 
                          value={formData.venue} 
                          onChange={handleChange}
                          placeholder="Class venue"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Scheduled Time</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="scheduled_time" 
                          value={formData.scheduled_time} 
                          onChange={handleChange}
                          placeholder="e.g., 9:00-11:00"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Recommendations</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          name="recommendations" 
                          value={formData.recommendations} 
                          onChange={handleChange}
                          placeholder="Any recommendations"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" className="btn-custom">Submit Report</Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Your Previous Reports</h3>
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
                  <th>Week</th>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td>{r.week}</td>
                    <td>{r.date}</td>
                    <td>{r.topic}</td>
                    <td>{r.present_students}/{r.total_students}</td>
                    <td>
                      <span className={`badge ${r.status === 'reviewed' ? 'bg-success' : 'bg-warning'}`}>
                        {r.status || 'pending'}
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
            <h2 className="mb-4">Attendance Stats & Student Feedback</h2>
            
            <Row className="mb-4">
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

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Student Feedback</h3>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search feedback..."
                  value={ratingSearch}
                  onChange={(e) => setRatingSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <ListGroup>
              {filteredStudentRatings.map(r => (
                <ListGroup.Item key={r.id} className="card-custom mb-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">Rating: {r.rating}/5</strong>
                        <div className="text-warning">
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </div>
                      </div>
                      <p className="mb-0">{r.comment}</p>
                    </div>
                    <small className="text-muted">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {activeTab === 'rating' && (
          <div id="rating">
            <h2 className="mb-4">Rate Facilities & Resources</h2>
            
            <Card className="card-custom mb-4">
              <Card.Body>
                <Form onSubmit={handleRatingSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Facility Rating (1-5)</Form.Label>
                        <Form.Select 
                          className="form-control-custom"
                          value={facilityRating} 
                          onChange={e => setFacilityRating(e.target.value)}
                        >
                          <option value={1}>1 - Poor</option>
                          <option value={2}>2 - Fair</option>
                          <option value={3}>3 - Good</option>
                          <option value={4}>4 - Very Good</option>
                          <option value={5}>5 - Excellent</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <div className="text-center">
                        <div className="text-warning" style={{ fontSize: '2rem' }}>
                          {'★'.repeat(facilityRating)}{'☆'.repeat(5 - facilityRating)}
                        </div>
                        <small className="text-muted">Your current rating</small>
                      </div>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Comments & Suggestions</Form.Label>
                    <Form.Control 
                      className="form-control-custom"
                      as="textarea"
                      rows={4}
                      value={facilityComment} 
                      onChange={e => setFacilityComment(e.target.value)} 
                      placeholder="Share your feedback about facilities, resources, or any suggestions for improvement..."
                    />
                  </Form.Group>
                  
                  <Button type="submit" className="btn-custom">Submit Rating</Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Your Previous Facility Ratings</h3>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search your ratings..."
                  value={ratingSearch}
                  onChange={(e) => setRatingSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            {filteredFacilityRatings.map(r => (
              <Card key={r.id} className="card-custom mb-2">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <strong className="me-2">Rating: {r.rating}/5</strong>
                        <div className="text-warning">
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </div>
                      </div>
                      <p className="mb-0">{r.comment}</p>
                    </div>
                    <small className="text-muted">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default LecturerDashboard;