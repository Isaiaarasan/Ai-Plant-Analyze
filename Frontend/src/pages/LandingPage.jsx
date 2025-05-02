import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Import placeholder images (you'll need to add these to your assets folder)
import healthyPlantImg from '../assets/images/healthy-plant.jpg';
import diseasedPlantImg from '../assets/images/diseased-plant.jpg';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Detect Plant Diseases Instantly with AI</h1>
            <p className="hero-subtitle">Empower your plants with cutting-edge technology</p>
            <Link to="/signup" className="btn btn-primary hero-cta">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Plant Visuals Section */}
      <section className="plant-visuals">
        <div className="container">
          <div className="visuals-grid">
            <div className="visual-item healthy">
              <div className="visual-image">
                <img src={healthyPlantImg} alt="Healthy Plant" />
              </div>
              <div className="visual-content">
                <h3>Healthy Plants</h3>
                <p>Learn how to maintain optimal plant health and prevent diseases</p>
              </div>
            </div>
            <div className="visual-item diseased">
              <div className="visual-image">
                <img src={diseasedPlantImg} alt="Diseased Plant" />
              </div>
              <div className="visual-content">
                <h3>Disease Detection</h3>
                <p>Identify plant diseases early and take appropriate action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <h3>Real-Time Camera Detection</h3>
              <p>Capture images directly from your device camera for instant analysis</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>AI-Powered Analysis</h3>
              <p>Advanced machine learning algorithms for accurate disease identification</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3>Expert Solutions</h3>
              <p>Receive detailed treatment recommendations and preventive care tips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-carousel">
            <div className="testimonial-item">
              <p className="testimonial-text">"Saved my tomato plants from blight! Detected the disease early and provided effective solutions."</p>
              <p className="testimonial-author">- Sarah Johnson</p>
            </div>
            <div className="testimonial-item">
              <p className="testimonial-text">"As a hobby gardener, this app has been a game-changer. No more guessing what's wrong with my plants!"</p>
              <p className="testimonial-author">- Michael Chen</p>
            </div>
            <div className="testimonial-item">
              <p className="testimonial-text">"The AI detection is impressively accurate. Identified powdery mildew on my roses before it spread."</p>
              <p className="testimonial-author">- Emma Rodriguez</p>
            </div>
            <div className="testimonial-item">
              <p className="testimonial-text">"Incredible tool for farmers. Helped me save my crops and significantly reduced losses."</p>
              <p className="testimonial-author">- Farmer John</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2>Ready to protect your plants?</h2>
          <p>Join thousands of gardeners and farmers who trust our AI technology</p>
          <Link to="/signup" className="btn btn-primary">Get Started Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>PlantAI</h3>
              <p>Protecting plants with technology</p>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Company</h4>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/cookies">Cookie Policy</Link></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/support">Support</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} PlantAI. All rights reserved.</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
