// components/LandingPage.js
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="landing-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="hero-content">
                <h1>Welcome to LUCT Faculty of ICT</h1>
                <p>Empowering Future Technology Leaders Through Innovative Education and Research</p>
               
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="text-gradient">Why Choose Our Faculty Portal?</h2>
              <p className="lead">Experience seamless academic management and collaboration</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <div className="feature-icon">📊</div>
                <Card.Body>
                  <Card.Title>Real-time Monitoring</Card.Title>
                  <Card.Text>
                    Track attendance, performance, and academic progress with comprehensive analytics and reporting tools.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <div className="feature-icon">👥</div>
                <Card.Body>
                  <Card.Title>Collaborative Learning</Card.Title>
                  <Card.Text>
                    Connect with lecturers, peers, and program leaders for enhanced learning experiences and feedback.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <div className="feature-icon">⚡</div>
                <Card.Body>
                  <Card.Title>Efficient Management</Card.Title>
                  <Card.Text>
                    Streamline course management, resource allocation, and academic planning across all departments.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2>Ready to Transform Your Academic Experience?</h2>
              <p className="mb-4">Join thousands of students and faculty members already using our platform</p>
              <Button as={Link} to="/register" className="btn-custom" size="lg">
                Create Your Account Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-3">
              <h3 className="text-gradient">1000+</h3>
              <p>Active Students</p>
            </Col>
            <Col md={3} className="mb-3">
              <h3 className="text-gradient">50+</h3>
              <p>Expert Lecturers</p>
            </Col>
            <Col md={3} className="mb-3">
              <h3 className="text-gradient">20+</h3>
              <p>Courses Offered</p>
            </Col>
            <Col md={3} className="mb-3">
              <h3 className="text-gradient">98%</h3>
              <p>Satisfaction Rate</p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LandingPage;