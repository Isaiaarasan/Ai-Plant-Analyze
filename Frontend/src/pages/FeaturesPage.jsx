import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturesPage.css';

const FeaturesPage = () => {
  return (
    <div className="features-page">
      <div className="container">
        <section className="features-hero">
          <div className="features-hero-content">
            <h1>PlantAI Features</h1>
            <p className="features-subtitle">Discover how our AI-powered platform helps you keep your plants healthy</p>
          </div>
        </section>

        <section className="features-overview">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <h3>Instant Disease Detection</h3>
              <p>Take a photo or upload an image of your plant and get instant analysis of potential diseases, pests, or nutrient deficiencies.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <h3>Plant Health Score</h3>
              <p>Receive a comprehensive health score for your plants based on multiple factors, helping you track improvements over time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3>Expert Recommendations</h3>
              <p>Get personalized treatment plans and prevention strategies from our database of expert knowledge and best practices.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Treatment Calendar</h3>
              <p>Schedule and track treatments with our integrated calendar system, ensuring you never miss a critical care step.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <h3>Detailed Analytics</h3>
              <p>Track your plant health over time with comprehensive analytics and insights to improve your gardening practices.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Multi-language Support</h3>
              <p>Access plant care information in multiple languages, making our platform accessible to gardeners worldwide.</p>
            </div>
          </div>
        </section>

        <section className="advanced-features">
          <div className="section-header">
            <h2>Advanced Features</h2>
            <p>Unlock the full potential of PlantAI with these powerful capabilities</p>
          </div>

          <div className="advanced-features-list">
            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>Weather Integration</h3>
                <p>Our system integrates with local weather data to provide context-aware recommendations based on current and forecasted conditions in your area.</p>
                <ul className="feature-benefits">
                  <li>Adjust watering schedules based on rainfall predictions</li>
                  <li>Receive alerts for extreme weather that might affect your plants</li>
                  <li>Get seasonal care tips relevant to your climate zone</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Weather Integration</div>
              </div>
            </div>

            <div className="advanced-feature reverse">
              <div className="advanced-feature-content">
                <h3>Community Disease Map</h3>
                <p>Contribute to and benefit from our community-powered disease tracking map that shows the prevalence of plant diseases in different regions.</p>
                <ul className="feature-benefits">
                  <li>Stay informed about disease outbreaks in your area</li>
                  <li>Take preventive measures before diseases reach your garden</li>
                  <li>Contribute to citizen science by sharing your findings</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Disease Map</div>
              </div>
            </div>

            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>Voice Commands</h3>
                <p>Interact with PlantAI using voice commands for a hands-free experience, perfect for when you're working in the garden with dirty hands.</p>
                <ul className="feature-benefits">
                  <li>Capture images and analyze plants using voice instructions</li>
                  <li>Listen to treatment recommendations while you work</li>
                  <li>Log garden activities without touching your device</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Voice Commands</div>
              </div>
            </div>

            <div className="advanced-feature reverse">
              <div className="advanced-feature-content">
                <h3>Educational Resources</h3>
                <p>Access our extensive library of educational content to deepen your understanding of plant health and sustainable gardening practices.</p>
                <ul className="feature-benefits">
                  <li>Detailed articles on plant diseases and prevention</li>
                  <li>Video tutorials on treatment application techniques</li>
                  <li>Interactive guides for different plant species</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Educational Resources</div>
              </div>
            </div>
          </div>
        </section>

        <section className="unique-features">
          <div className="section-header">
            <h2>What Makes Us Unique</h2>
            <p>Features that set PlantAI apart from other plant care applications</p>
          </div>

          <div className="unique-features-grid">
            <div className="unique-feature">
              <div className="unique-feature-icon">
              
              </div>
              <div className="unique-feature-content">
                <h3>Offline Mode</h3>
                <p>Use core features even without an internet connection, perfect for remote gardens or areas with poor connectivity.</p>
              </div>
            </div>

            <div className="unique-feature">

              <div className="unique-feature-content">
                <h3>Plant Health Timeline</h3>
                <p>Track the progression of your plant's health over time with visual timelines and progress indicators.</p>
              </div>
            </div>

            <div className="unique-feature">
              <div className="unique-feature-icon">
                
              </div>
              <div className="unique-feature-content">
                <h3>Community Forum</h3>
                <p>Connect with fellow gardeners and plant enthusiasts to share experiences, ask questions, and get advice.</p>
              </div>
            </div>

            <div className="unique-feature">
              <div className="unique-feature-icon">
               
              </div>
              <div className="unique-feature-content">
                <h3>Gamification</h3>
                <p>Earn badges, complete challenges, and track achievements as you care for your plants and improve your gardening skills.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="advanced-features">
          <div className="section-header">
            <h2>Advanced Features</h2>
            <p>Unlock the full potential of PlantAI with these powerful capabilities</p>
          </div>

          <div className="advanced-features-list">
            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>Weather Integration</h3>
                <p>Our system integrates with local weather data to provide context-aware recommendations based on current and forecasted conditions in your area.</p>
                <ul className="feature-benefits">
                  <li>Adjust watering schedules based on rainfall predictions</li>
                  <li>Receive alerts for extreme weather that might affect your plants</li>
                  <li>Get seasonal care tips relevant to your climate zone</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Weather Integration</div>
              </div>
            </div>

            <div className="advanced-feature reverse">
              <div className="advanced-feature-content">
                <h3>Community Disease Map</h3>
                <p>Contribute to and benefit from our community-powered disease tracking map that shows the prevalence of plant diseases in different regions.</p>
                <ul className="feature-benefits">
                  <li>Stay informed about disease outbreaks in your area</li>
                  <li>Take preventive measures before diseases reach your garden</li>
                  <li>Contribute to citizen science by sharing your findings</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Disease Map</div>
              </div>
            </div>

            <div className="advanced-feature">
              <div className="advanced-feature-content">
                <h3>Voice Commands</h3>
                <p>Interact with PlantAI using voice commands for a hands-free experience, perfect for when you're working in the garden with dirty hands.</p>
                <ul className="feature-benefits">
                  <li>Capture images and analyze plants using voice instructions</li>
                  <li>Listen to treatment recommendations while you work</li>
                  <li>Log garden activities without touching your device</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Voice Commands</div>
              </div>
            </div>

            <div className="advanced-feature reverse">
              <div className="advanced-feature-content">
                <h3>Educational Resources</h3>
                <p>Access our extensive library of educational content to deepen your understanding of plant health and sustainable gardening practices.</p>
                <ul className="feature-benefits">
                  <li>Detailed articles on plant diseases and prevention</li>
                  <li>Video tutorials on treatment application techniques</li>
                  <li>Interactive guides for different plant species</li>
                </ul>
              </div>
              <div className="advanced-feature-image">
                <div className="placeholder-image">Educational Resources</div>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that works best for your gardening needs</p>
          </div>

          <div className="pricing-plans">
            <div className="pricing-plan">
              <div className="plan-header">
                <h3>Basic</h3>
                <div className="plan-price">
                  <span className="price">Free</span>
                </div>
                <p>Perfect for casual gardeners</p>
              </div>
              <div className="plan-features">
                <ul>
                  <li>10 disease detections per month</li>
                  <li>Basic treatment recommendations</li>
                  <li>Plant health history (30 days)</li>
                  <li>Community forum access</li>
                </ul>
              </div>
              <div className="plan-footer">
                <button className="btn btn-outline">Sign Up Free</button>
              </div>
            </div>

            <div className="pricing-plan popular">
              <div className="popular-tag">Most Popular</div>
              <div className="plan-header">
                <h3>Premium</h3>
                <div className="plan-price">
                  <span className="price">$5.99</span> / month
                </div>
                <p>For dedicated plant enthusiasts</p>
              </div>
              <div className="plan-features">
                <ul>
                  <li>Unlimited disease detections</li>
                  <li>Advanced treatment recommendations</li>
                  <li>Complete plant health history</li>
                  <li>Weather integration</li>
                  <li>Educational resources</li>
                  <li>Offline mode</li>
                </ul>
              </div>
              <div className="plan-footer">
                <button className="btn">Get Premium</button>
              </div>
            </div>

            <div className="pricing-plan">
              <div className="plan-header">
                <h3>Professional</h3>
                <div className="plan-price">
                  <span className="price">$12.99</span> / month
                </div>
                <p>For serious growers and small farms</p>
              </div>
              <div className="plan-features">
                <ul>
                  <li>All Premium features</li>
                  <li>Expert consultation access</li>
                  <li>Multi-user accounts</li>
                  <li>Priority support</li>
                  <li>API access</li>
                  <li>Custom reporting</li>
                </ul>
              </div>
              <div className="plan-footer">
                <button className="btn">Get Professional</button>
              </div>
            </div>
          </div>
        </section>

        <section className="features-cta">
          <h2>Ready to transform your plant care routine?</h2>
          <p>Join thousands of gardeners who are using PlantAI to keep their plants healthy and thriving.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <Link to="/about" className="btn btn-outline">Learn About Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturesPage;
