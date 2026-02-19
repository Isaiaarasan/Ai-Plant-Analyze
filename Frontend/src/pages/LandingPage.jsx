import React from 'react';
import { Link } from 'react-router-dom';


// Import placeholder images (you'll need to add these to your assets folder)
import healthyPlantImg from '../assets/images/healthy-plant.jpg';
import diseasedPlantImg from '../assets/images/diseased-plant.jpg';

const LandingPage = () => {
  const LandingPage = () => {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary-light to-primary text-white text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Detect Plant Diseases Instantly with AI
              </h1>
              <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl">
                Empower your plants with cutting-edge technology for healthier growth and better yields.
              </p>
              <Link to="/signup" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Plant Visuals Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="h-64 overflow-hidden">
                  <img
                    src={healthyPlantImg}
                    alt="Healthy Plant"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Healthy Plants</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Learn how to maintain optimal plant health and prevent diseases with our comprehensive guides.
                  </p>
                </div>
              </div>
              <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="h-64 overflow-hidden">
                  <img
                    src={diseasedPlantImg}
                    alt="Diseased Plant"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">Disease Detection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Identify plant diseases early with AI analysis and take appropriate action to save your crops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-green-100 text-primary rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Real-Time Detection</h3>
                <p className="text-gray-600">Capture images directly from your device camera for instant disease analysis in seconds.</p>
              </div>
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">AI-Powered Analysis</h3>
                <p className="text-gray-600">Advanced machine learning algorithms trained on thousands of plant images for high accuracy.</p>
              </div>
              <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Expert Solutions</h3>
                <p className="text-gray-600">Receive detailed treatment recommendations, preventive care tips, and expert advice.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">What Our Users Say</h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 scrollbar-hide">
              <div className="min-w-[300px] md:min-w-[350px] flex-none snap-center bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-6 text-lg">"Saved my tomato plants from blight! Detected the disease early and provided effective solutions."</p>
                <p className="font-bold text-primary">- Sarah Johnson</p>
              </div>
              <div className="min-w-[300px] md:min-w-[350px] flex-none snap-center bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-6 text-lg">"As a hobby gardener, this app has been a game-changer. No more guessing what's wrong with my plants!"</p>
                <p className="font-bold text-primary">- Michael Chen</p>
              </div>
              <div className="min-w-[300px] md:min-w-[350px] flex-none snap-center bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-6 text-lg">"The AI detection is impressively accurate. Identified powdery mildew on my roses before it spread."</p>
                <p className="font-bold text-primary">- Emma Rodriguez</p>
              </div>
              <div className="min-w-[300px] md:min-w-[350px] flex-none snap-center bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-6 text-lg">"Incredible tool for farmers. Helped me save my crops and significantly reduced losses."</p>
                <p className="font-bold text-primary">- Farmer John</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to protect your plants?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of gardeners and farmers who trust our AI technology to keep their green friends healthy.</p>
            <Link to="/signup" className="btn bg-white text-primary hover:bg-gray-100 font-bold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white pt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-primary mr-2">🌿</span> PlantAI
                </h3>
                <p className="text-gray-400 max-w-sm">
                  Empowering gardeners and farmers with state-of-the-art technology to protect plants and ensure bountiful harvests.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-primary inline-block pb-1">Company</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link to="/careers" className="text-gray-400 hover:text-primary transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-primary inline-block pb-1">Legal</h4>
                <ul className="space-y-3">
                  <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link to="/cookies" className="text-gray-400 hover:text-primary transition-colors">Cookie Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-primary inline-block pb-1">Resources</h4>
                <ul className="space-y-3">
                  <li><Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
                  <li><Link to="/support" className="text-gray-400 hover:text-primary transition-colors">Support</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} PlantAI. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
};

export default LandingPage;
