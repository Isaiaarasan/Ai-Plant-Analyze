import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-20 pt-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">PlantAI Features</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover how our AI-powered platform helps you keep your plants healthy and thriving.</p>
        </section>

        {/* Feature Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Disease Detection', desc: 'Take a photo or upload an image of your plant and get instant analysis of potential diseases, pests, or nutrient deficiencies.', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                )
              },
              {
                title: 'Plant Health Score', desc: 'Receive a comprehensive health score for your plants based on multiple factors, helping you track improvements over time.', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                )
              },
              {
                title: 'Expert Recommendations', desc: 'Get personalized treatment plans and prevention strategies from our database of expert knowledge and best practices.', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                )
              },
              {
                title: 'Treatment Calendar', desc: 'Schedule and track treatments with our integrated calendar system, ensuring you never miss a critical care step.', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                )
              },
              {
                title: 'Detailed Analytics', desc: 'Track your plant health over time with comprehensive analytics and insights to improve your gardening practices.', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                )
              },
              {
                title: 'Multi-language Support', desc: 'Access plant care information in multiple languages, making our platform accessible to gardeners worldwide.', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Choose the plan that works best for your gardening needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Basic</h3>
                <div className="text-4xl font-bold text-primary mb-2">Free</div>
                <p className="text-gray-500">Perfect for casual gardeners</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['10 disease detections per month', 'Basic treatment recommendations', 'Plant health history (30 days)', 'Community forum access'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">Sign Up Free</button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-primary shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">MOST POPULAR</div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-primary mb-2">$5.99 <span className="text-base font-normal text-gray-500">/ month</span></div>
                <p className="text-gray-500">For dedicated plant enthusiasts</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['Unlimited disease detections', 'Advanced treatment recommendations', 'Complete plant health history', 'Weather integration', 'Educational resources', 'Offline mode'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-xl bg-primary text-white font-bold hover:bg-green-600 transition-colors shadow-lg">Get Premium</button>
            </div>

            {/* Professional Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Professional</h3>
                <div className="text-4xl font-bold text-primary mb-2">$12.99 <span className="text-base font-normal text-gray-500">/ month</span></div>
                <p className="text-gray-500">For serious growers and small farms</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {['All Premium features', 'Expert consultation access', 'Multi-user accounts', 'Priority support', 'API access', 'Custom reporting'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">Get Professional</button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your plant care routine?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Join thousands of gardeners who are using PlantAI to keep their plants healthy and thriving.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-600 transition-colors">Get Started</Link>
              <Link to="/about" className="px-8 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-colors">Learn About Us</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FeaturesPage;
