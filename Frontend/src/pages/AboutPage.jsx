import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <section className="bg-primary rounded-3xl p-12 mb-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About PlantAI</h1>
            <p className="text-xl opacity-90 leading-relaxed">Empowering gardeners and plant enthusiasts with AI-powered plant disease detection</p>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </section>

        <section className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block after:content-[''] after:block after:w-20 after:h-1 after:bg-primary after:mx-auto after:mt-4">Our Mission</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed text-lg space-y-6">
            <p>
              At PlantAI, we believe that everyone should have access to the tools and knowledge needed to maintain healthy plants. Our mission is to leverage cutting-edge artificial intelligence technology to help gardeners, farmers, and plant enthusiasts identify and treat plant diseases quickly and effectively.
            </p>
            <p>
              By providing an easy-to-use platform for plant disease detection, we aim to reduce crop losses, promote sustainable gardening practices, and foster a deeper connection between people and the plants they care for.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple steps to healthy plants</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Capture', desc: 'Take a photo of your plant showing symptoms or upload an existing image.' },
              { num: '2', title: 'Analyze', desc: 'Our AI model analyzes the image to identify diseases, pests, or nutrient deficiencies.' },
              { num: '3', title: 'Diagnose', desc: 'Receive a detailed diagnosis with confidence level and severity assessment.' },
              { num: '4', title: 'Treat', desc: 'Get personalized treatment recommendations and preventive measures.' }
            ].map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 bg-green-50 text-primary font-bold text-2xl rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Technology</h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-600 text-center mb-12 text-lg max-w-3xl mx-auto">
              PlantAI uses state-of-the-art deep learning models trained on thousands of images of healthy and diseased plants. Our technology can identify over 50 different plant diseases across 20+ plant species with high accuracy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Advanced Image Recognition', desc: 'Our AI can detect subtle patterns and symptoms that might be missed by the human eye.' },
                { title: 'Multi-language Support', desc: 'Access plant health information in multiple languages to serve our global community.' },
                { title: 'Offline Capabilities', desc: 'Use core features even without an internet connection, perfect for field work.' },
                { title: 'Continuous Learning', desc: 'Our system improves over time as it processes more images and receives expert feedback.' }
              ].map((feature, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/50 transition-colors">
                  <div className="flex-shrink-0 w-3 h-3 mt-2 rounded-full bg-primary"></div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Developer</h2>
            <p className="text-gray-600">The minds behind PlantAI</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              
              { initial: 'EP', name: 'Elavarasan P', role: 'Full Stack Developer' },
             
            ].map((member, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all text-center group border border-gray-100 hover:-translate-y-2 duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform group-hover:scale-110 transition-transform">
                  {member.initial}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-4 text-sm uppercase tracking-wide">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">Currently pursuing his second year of Computer Science Engineering at Sri Eshwar College of Engineering.</p>
              </div>
            ))}
          </div>
        </section>

        {/* <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 opacity-70">Trusted Partners</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {['University of Agriculture', 'Global Farming Initiative', 'Tech for Earth Foundation', 'Sustainable Gardening Association'].map((partner, i) => (
                <div key={i} className="flex items-center font-bold text-xl">{partner}</div>
              ))}
            </div>
          </div>
        </section> */}

        <section className="bg-gradient-to-r from-green-600 to-primary rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to keep your plants healthy?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of gardeners and plant enthusiasts who use PlantAI to detect and treat plant diseases.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">Get Started</Link>
              <Link to="/features" className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">Explore Features</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-5 rounded-full blur-3xl"></div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
