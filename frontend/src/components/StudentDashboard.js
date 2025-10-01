import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Nav, Table, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [lecturerId, setLecturerId] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [ratingSearch, setRatingSearch] = useState('');
  const [activeTab, setActiveTab] = useState('monitoring');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const resReports = await axios.get('http://localhost:5000/reports', config);
        setReports(resReports.data);
        const resRatings = await axios.get('http://localhost:5000/ratings', config);
        setRatings(resRatings.data);
      } catch (err) {
        toast.error('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/ratings', { ratee_id: lecturerId, rating, comment, type: 'student_to_lecturer' }, config);
      toast.success('Rating submitted');
      setLecturerId('');
      setRating(1);
      setComment('');
      const resRatings = await axios.get('http://localhost:5000/ratings', config);
      setRatings(resRatings.data);
    } catch (err) {
      toast.error('Error submitting rating');
    }
  };

  // Search functions
  const filteredReports = reports.filter(r => 
    r.course_name.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.topic.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.date.includes(reportSearch)
  );

  const filteredRatings = ratings
    .filter(r => r.type === 'student_to_lecturer')
    .filter(r => 
      r.comment.toLowerCase().includes(ratingSearch.toLowerCase()) ||
      r.rating.toString().includes(ratingSearch)
    );

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dashboard-title">Student Dashboard</h1>
            <p className="dashboard-subtitle">Monitor your attendance and provide feedback</p>
          </div>
          <Button as={Link} to="/" variant="outline-primary" className="btn-custom">
            ← Back to Home
          </Button>
        </div>
      </div>

      <Nav variant="tabs" className="dashboard-nav" activeKey={activeTab} onSelect={setActiveTab}>
        <Nav.Item>
          <Nav.Link eventKey="monitoring">Monitoring</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="rating">Rating</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="dashboard-content">
        {activeTab === 'monitoring' && (
          <div id="monitoring">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Attendance & Performance Reports</h2>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search reports by course, topic, or date..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            <Table striped bordered hover className="table-custom">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(r => (
                  <tr key={r.id}>
                    <td>{r.course_name}</td>
                    <td>{r.date}</td>
                    <td>{r.topic}</td>
                    <td>{r.present_students}/{r.total_students}</td>
                    <td>
                      <span className={`badge ${r.present_students/r.total_students >= 0.75 ? 'bg-success' : 'bg-warning'}`}>
                        {r.present_students/r.total_students >= 0.75 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {activeTab === 'rating' && (
          <div id="rating">
            <h2 className="mb-4">Rate Your Lectures</h2>
            <Card className="card-custom mb-4">
              <Card.Body>
                <Form onSubmit={handleRatingSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Lecturer ID</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          value={lecturerId} 
                          onChange={e => setLecturerId(e.target.value)} 
                          placeholder="Enter lecturer ID"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rating (1-5)</Form.Label>
                        <Form.Control 
                          className="form-control-custom"
                          type="number" 
                          min={1} 
                          max={5} 
                          value={rating} 
                          onChange={e => setRating(e.target.value)} 
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control 
                      className="form-control-custom"
                      as="textarea" 
                      rows={3}
                      value={comment} 
                      onChange={e => setComment(e.target.value)} 
                      placeholder="Share your feedback about the lecture..."
                    />
                  </Form.Group>
                  <Button type="submit" className="btn-custom">Submit Rating</Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Your Previous Ratings</h3>
              <Form.Group className="mb-3" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search your ratings..."
                  value={ratingSearch}
                  onChange={(e) => setRatingSearch(e.target.value)}
                />
              </Form.Group>
            </div>
            {filteredRatings.map(r => (
              <Card key={r.id} className="card-custom mb-2">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Rating: {r.rating}/5</strong>
                      <p className="mb-0 mt-1">{r.comment}</p>
                    </div>
                    <small className="text-muted">{new Date(r.created_at).toLocaleDateString()}</small>
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

export default StudentDashboard;