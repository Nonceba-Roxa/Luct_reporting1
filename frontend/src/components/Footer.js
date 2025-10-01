import React, { useState } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleClose = () => {
    setShowAbout(false);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
  };

  return (
    <>
      <footer className="footer-custom">
        <Container>
          <div className="footer-content">
            <p>&copy; 2025 LUCT Faculty of ICT. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about" onClick={(e) => { e.preventDefault(); setShowAbout(true); }}>About</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); setShowContact(true); }}>Contact</a>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms of Service</a>
            </div>
          </div>
        </Container>
      </footer>

      {/* About Modal */}
      <Modal show={showAbout} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>About LUCT Faculty of ICT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="about-content">
            <h5 className="text-luct mb-3">Welcome to the Faculty of Information and Communication Technology</h5>
            
            <div className="mb-4">
              <h6>Our Mission</h6>
              <p>
                To provide quality education and research in Information and Communication Technology, 
                producing competent professionals who can contribute to technological advancement and 
                national development.
              </p>
            </div>

            <div className="mb-4">
              <h6>Programs Offered</h6>
              <ul>
                <li>Bachelor of Science in Information Technology</li>
                <li>Bachelor of Science in Information Systems</li>
                <li>Bachelor of Science in Computer Science</li>
                <li>Bachelor of Science in Software Engineering</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>Our Vision</h6>
              <p>
                To be a center of excellence in ICT education and research, recognized for innovation, 
                academic excellence, and contribution to the digital transformation of society.
              </p>
            </div>

            <div>
              <h6>Key Features</h6>
              <ul>
                <li>State-of-the-art computer laboratories</li>
                <li>Industry partnerships and internships</li>
                <li>Research and development centers</li>
                <li>Professional certification programs</li>
                <li>International collaborations</li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contact Modal */}
      <Modal show={showContact} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="contact-content">
            <h5 className="text-luct mb-4">Get in Touch with Faculty of ICT</h5>
            
            <div className="mb-4">
              <h6>📍 Location</h6>
              <p>
                LUCT Main Campus<br />
                Faculty of ICT Building<br />
                Maseru<br />
                Lesotho
              </p>
            </div>

            <div className="mb-4">
              <h6>📞 Phone Numbers</h6>
              <p>
                Main Office: +266 588 123 456<br />
                Dean's Office: +266 628 123 457<br />
                Student Affairs: +266 578 123 458
              </p>
            </div>

            <div className="mb-4">
              <h6>📧 Email Addresses</h6>
              <p>
                General Inquiries: ict@luct.ac.rw<br />
                Admissions: admissions.ict@luct.ac.rw<br />
                Dean's Office: dean.ict@luct.ac.rw<br />
                Technical Support: support.ict@luct.ac.rw
              </p>
            </div>

            <div className="mb-4">
              <h6>🕒 Office Hours</h6>
              <p>
                Monday - Friday: 8:00 AM - 5:00 PM<br />
                Saturday: 9:00 AM - 1:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <h6>🌐 Social Media</h6>
              <p>
                Facebook: /LUCTFacultyICT<br />
                Twitter: @LUCT_ICT<br />
                LinkedIn: LUCT Faculty of ICT
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal show={showPrivacy} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="privacy-content">
            <h5 className="text-luct mb-4">LUCT Faculty of ICT Privacy Policy</h5>
            
            <div className="mb-4">
              <h6>1. Information We Collect</h6>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul>
                <li>Personal identification information (name, email address, student ID)</li>
                <li>Academic records and performance data</li>
                <li>Attendance and participation information</li>
                <li>Communication preferences</li>
                <li>Technical data (IP address, browser type, device information)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>2. How We Use Your Information</h6>
              <p>
                Your information is used for:
              </p>
              <ul>
                <li>Academic management and reporting</li>
                <li>Communication regarding courses and programs</li>
                <li>System administration and technical support</li>
                <li>Research and institutional improvement</li>
                <li>Compliance with educational regulations</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>3. Data Protection</h6>
              <p>
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. All data 
                is stored on secure servers with restricted access.
              </p>
            </div>

            <div className="mb-4">
              <h6>4. Data Sharing</h6>
              <p>
                We do not sell or rent your personal information to third parties. We may share 
                information with:
              </p>
              <ul>
                <li>Academic staff and administrators for educational purposes</li>
                <li>Government agencies as required by law</li>
                <li>Accreditation bodies for quality assurance</li>
                <li>Service providers under strict confidentiality agreements</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>5. Your Rights</h6>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data (where applicable)</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </div>

            <div>
              <h6>6. Contact Us</h6>
              <p>
                For privacy-related inquiries, contact our Data Protection Officer at:<br />
                <strong>dpo@luct.ac.rw</strong>
              </p>
            </div>

            <div className="mt-4 p-3 bg-light rounded">
              <small>
                <strong>Last Updated:</strong> January 2024<br />
                This policy may be updated periodically. Please check back for changes.
              </small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal show={showTerms} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Terms of Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="terms-content">
            <h5 className="text-luct mb-4">LUCT Faculty Portal - Terms of Service</h5>
            
            <div className="mb-4">
              <h6>1. Acceptance of Terms</h6>
              <p>
                By accessing and using the LUCT Faculty Portal, you accept and agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not use 
                the portal.
              </p>
            </div>

            <div className="mb-4">
              <h6>2. User Accounts</h6>
              <p>
                <strong>Eligibility:</strong> Access is restricted to registered students, faculty members, 
                and authorized staff of LUCT Faculty of ICT.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for maintaining the confidentiality 
                of your login credentials and for all activities that occur under your account.
              </p>
              <p>
                <strong>Account Termination:</strong> The institution reserves the right to suspend or 
                terminate accounts that violate these terms or institutional policies.
              </p>
            </div>

            <div className="mb-4">
              <h6>3. Acceptable Use</h6>
              <p>You agree to use the portal for legitimate academic purposes only:</p>
              <ul>
                <li>Access course materials and submit assignments</li>
                <li>Communicate with instructors and peers</li>
                <li>View academic records and progress</li>
                <li>Participate in academic activities</li>
              </ul>
              <p><strong>Prohibited activities include:</strong></p>
              <ul>
                <li>Unauthorized access to other users' accounts or data</li>
                <li>Distribution of malicious software</li>
                <li>Academic dishonesty or plagiarism</li>
                <li>Harassment or inappropriate communication</li>
                <li>Commercial use of institutional resources</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>4. Intellectual Property</h6>
              <p>
                All content on this portal, including course materials, software, and institutional 
                information, is the property of LUCT Faculty of ICT and is protected by copyright 
                and intellectual property laws.
              </p>
            </div>

            <div className="mb-4">
              <h6>5. Privacy and Data Protection</h6>
              <p>
                Your use of the portal is subject to our Privacy Policy. We are committed to 
                protecting your personal information in accordance with applicable data protection 
                laws.
              </p>
            </div>

            <div className="mb-4">
              <h6>6. System Availability</h6>
              <p>
                While we strive to maintain 24/7 availability, the portal may be temporarily 
                unavailable for maintenance, updates, or due to technical issues. We are not 
                liable for any inconvenience caused by system downtime.
              </p>
            </div>

            <div className="mb-4">
              <h6>7. Limitation of Liability</h6>
              <p>
                LUCT Faculty of ICT is not liable for any indirect, incidental, or consequential 
                damages arising from the use or inability to use the portal.
              </p>
            </div>

            <div className="mb-4">
              <h6>8. Changes to Terms</h6>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the 
                portal after changes constitutes acceptance of the modified terms.
              </p>
            </div>

            <div className="mb-4">
              <h6>9. Governing Law</h6>
              <p>
                These terms are governed by the laws of Rwanda. Any disputes shall be resolved 
                through the institutional dispute resolution process.
              </p>
            </div>

            <div className="mt-4 p-3 bg-light rounded">
              <small>
                <strong>Last Updated:</strong> January 2025<br />
                For questions about these terms, contact: legal@luct.ac.rw
              </small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Footer;