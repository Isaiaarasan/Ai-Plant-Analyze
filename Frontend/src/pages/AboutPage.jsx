import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>About PlantAI</h1>
            <p className="about-subtitle">Empowering gardeners and plant enthusiasts with AI-powered plant disease detection</p>
          </div>
        </section>

        <section className="about-mission">
          <div className="about-section-header">
            <h2>Our Mission</h2>
          </div>
          <div className="about-section-content">
            <p>
              At PlantAI, we believe that everyone should have access to the tools and knowledge needed to maintain healthy plants. Our mission is to leverage cutting-edge artificial intelligence technology to help gardeners, farmers, and plant enthusiasts identify and treat plant diseases quickly and effectively.
            </p>
            <p>
              By providing an easy-to-use platform for plant disease detection, we aim to reduce crop losses, promote sustainable gardening practices, and foster a deeper connection between people and the plants they care for.
            </p>
          </div>
        </section>

        <section className="about-how-it-works">
          <div className="about-section-header">
            <h2>How It Works</h2>
          </div>
          <div className="about-steps">
            <div className="about-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Capture</h3>
                <p>Take a photo of your plant showing symptoms or upload an existing image.</p>
              </div>
            </div>
            <div className="about-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Analyze</h3>
                <p>Our AI model analyzes the image to identify diseases, pests, or nutrient deficiencies.</p>
              </div>
            </div>
            <div className="about-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Diagnose</h3>
                <p>Receive a detailed diagnosis with confidence level and severity assessment.</p>
              </div>
            </div>
            <div className="about-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Treat</h3>
                <p>Get personalized treatment recommendations and preventive measures.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-technology">
          <div className="about-section-header">
            <h2>Our Technology</h2>
          </div>
          <div className="about-section-content">
            <p>
              PlantAI uses state-of-the-art deep learning models trained on thousands of images of healthy and diseased plants. Our technology can identify over 50 different plant diseases across 20+ plant species with high accuracy.
            </p>
            <p>
              We continuously improve our models by incorporating feedback from plant pathologists and our user community, ensuring that our detection capabilities remain at the cutting edge.
            </p>
            <div className="tech-features">
              <div className="tech-feature">
                <h3>Advanced Image Recognition</h3>
                <p>Our AI can detect subtle patterns and symptoms that might be missed by the human eye.</p>
              </div>
              <div className="tech-feature">
                <h3>Multi-language Support</h3>
                <p>Access plant health information in multiple languages to serve our global community.</p>
              </div>
              <div className="tech-feature">
                <h3>Offline Capabilities</h3>
                <p>Use core features even without an internet connection, perfect for field work.</p>
              </div>
              <div className="tech-feature">
                <h3>Continuous Learning</h3>
                <p>Our system improves over time as it processes more images and receives expert feedback.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="about-section-header">
            <h2>Our Team</h2>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-avatar">
                <span>DS</span>
              </div>
              <h3>Dharshan S M</h3>
              <p className="team-role">Full Stack Developer</p>
              <p className="team-bio">Currently pursuing his second year of Computer Science Engineering at Sri Eshwar College of Engineering.</p>
            </div>
            <div className="team-member">
              <div className="team-member-avatar">
                <span>AR</span>
              </div>
              <h3>Elavarasan P</h3>
              <p className="team-role">UX Designer</p>
              <p className="team-bio">Currently pursuing his second year of Computer Science Engineering at Sri Eshwar College of Engineering.</p>
            </div>
            <div className="team-member">
              <div className="team-member-avatar">
                <span>JJ</span>
              </div>
              <h3>JeganVijay</h3>
              <p className="team-role">Full Stack Developer</p>
              <p className="team-bio">Currently pursuing his second year of Computer Science Engineering at Sri Eshwar College of Engineering.</p>
            </div>
            <div className="team-member">
              <div className="team-member-avatar">
                <span>JS</span>
              </div>
              <h3>JayaSurya</h3>
              <p className="team-role">Full Stack Developer</p>
              <p className="team-bio">Currently pursuing his second year of Computer Science Engineering at Sri Eshwar College of Engineering.</p>
            </div>
          </div>
        </section>

        <section className="about-partners">
          <div className="about-section-header">
            <h2>Our Partners</h2>
          </div>
          <div className="partners-grid">
            <div className="partner">
              <div className="partner-logo">University of Agriculture</div>
            </div>
            <div className="partner">
              <div className="partner-logo">Global Farming Initiative</div>
            </div>
            <div className="partner">
              <div className="partner-logo">Tech for Earth Foundation</div>
            </div>
            <div className="partner">
              <div className="partner-logo">Sustainable Gardening Association</div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>Ready to keep your plants healthy?</h2>
          <p>Join thousands of gardeners and plant enthusiasts who use PlantAI to detect and treat plant diseases.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <Link to="/features" className="btn btn-outline">Learn More</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
