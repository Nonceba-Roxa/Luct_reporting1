import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Student',
    stream: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (['Lecturer', 'PRL', 'PL'].includes(formData.role) && !formData.stream) {
      toast.error('Please select a stream for your role');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/register', formData);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} xl={5}>
          {/* Back Button */}
          <div className="mb-4">
            <Button as={Link} to="/" variant="outline-primary" size="sm">
              ← Back to Home
            </Button>
          </div>

          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="auth-icon mb-3"><div className="auth-icon-inner">👤</div></div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join the LUCT Reporting System</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        disabled={isLoading}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        disabled={isLoading}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="PRL">PRL</option>
                    <option value="PL">PL</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Stream</Form.Label>
                  <Form.Select
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">Select Stream (Optional)</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Information System">Information System</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Required for Lecturers, PRLs, and PLs
                  </Form.Text>
                </Form.Group>

                <Button type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>

              <div className="text-center my-4">
                <small className="text-muted">Already have an account?</small>
              </div>

              <p className="text-center mb-0">
                Already registered?{' '}
                <Link to="/login">Sign in here</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
