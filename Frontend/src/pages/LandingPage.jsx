import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import new high-quality images
import healthyPlantImg from '../assets/images/healthy_hero.png';
import diseasedPlantImg from '../assets/images/diseased_detail.png';
import scanningDemoImg from '../assets/images/scanning_demo.png';

const LandingPage = () => {
  useEffect(() => {
    // Basic reveal effect on scroll
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-mesh overflow-x-hidden">
      {/* Navigation - Simple Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <nav className="container mx-auto glass-card rounded-3xl px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-gradient flex items-center space-x-2">
            <span>🌿</span>
            <span>PlantAI</span>
          </Link>
          <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-slate-600">
            <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link to="/forum" className="hover:text-primary transition-colors">Community</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-800 hover:text-primary transition-colors">Sign In</Link>
            <Link to="/signup" className="btn btn-primary px-6 py-2.5 text-sm">Join Now</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal order-2 lg:order-1">
            <div className="inline-block px-4 py-1.5 mb-4 glass-card border- emerald-100 rounded-full text-primary font-bold text-xs uppercase tracking-widest">
              AI-Powered Plant Care 
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              Detect Plant <span className="text-gradient">Diseases</span> Instantly.
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              Equip your farm or garden with cutting-edge AI. Scan a leaf, identify the problem, and get expert treatment plans in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn btn-primary text-lg px-10 shadow-emerald-200">
                Start Pro Scan
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
              <Link to="/about" className="btn glass-card text-lg px-10 hover:bg-white text-slate-700">
                Learn More
              </Link>
            </div>
            
            <div className="mt-12 flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/40?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-500">
                <span className="text-slate-900 font-bold">50k+</span> Trusted by growers worldwide
              </div>
            </div>
          </div>
          
          <div className="reveal order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-400 to-sky-400 opacity-20 blur-3xl animate-float"></div>
              <div className="relative glass-card p-4 rounded-[3rem] shadow-2xl animate-float">
                <img 
                  src={healthyPlantImg} 
                  alt="Healthy Plant" 
                  className="rounded-[2.5rem] w-full max-w-[500px] object-cover"
                />
                <div className="absolute -bottom-8 -left-8 p-6 glass-card rounded-3xl shadow-xl max-w-[220px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-900">HEALTH SCAN: 98%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Optimal nutrients and sunlight detected for your Monstera.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="reveal text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Designed for Every <span className="text-gradient">Green Friend</span>.</h2>
            <p className="text-lg text-slate-500">From hobbyist balcony tomatoes to commercial corn crops, PlantAI adapts to your specific needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="reveal glass-card p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-default group">
              <div className="w-16 h-16 mb-8 flex items-center justify-center bg-emerald-50 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4">Precision Cam</h3>
              <p className="text-slate-500 leading-relaxed">Advanced computer vision optimized for mobile cameras to capture micro-fungal signatures.</p>
            </div>

            {/* Feature 2 */}
            <div className="reveal glass-card p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-default group">
              <div className="w-16 h-16 mb-8 flex items-center justify-center bg-sky-50 text-secondary rounded-2xl group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 8-2-2-5 5-3-3-7 7 2 2 5-5 3 3 7-7Z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4">ML Intelligence</h3>
              <p className="text-slate-500 leading-relaxed">Trained on over 1.2M disease patterns across 400+ common crop varieties worldwide.</p>
            </div>

            {/* Feature 3 */}
            <div className="reveal glass-card p-10 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-default group">
              <div className="w-16 h-16 mb-8 flex items-center justify-center bg-rose-50 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4">Expert Support</h3>
              <p className="text-slate-500 leading-relaxed">Direct line to agronomists and botanists for severity level 5 plant emergencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Comparison Section */}
      <section className="py-16 bg-mesh">
        <div className="container mx-auto px-6">
          <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[3rem] shadow-2xl">
                <img src={scanningDemoImg} alt="Scanning Plant" className="w-full h-auto" />
                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-emerald-500/50 blur-[2px] animate-[pulse_2s_infinite]"></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Identify <span className="text-rose-500">Diseases</span> Before They Spread.</h2>
              <p className="text-lg text-slate-600 mb-10">Our AI identifies microscopic markers of rust, blight, and fungal infestations while they are still treatable – saving both your plant and your investment.</p>
              
              <div className="space-y-6">
                {[
                  { title: "99.4% Recognition Accuracy", desc: "Top-tier vision model specifically for botanical patterns." },
                  { title: "Real-time Processing", desc: "No waiting for lab results. Get immediate answers onsite." },
                  { title: "Offline Capabilities", desc: "Scan even in remote fields with zero internet connectivity." }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-xl font-black text-primary uppercase tracking-[0.2em] mb-12">Community Voices</h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 scrollbar-hide">
            {[
              { name: "Sarah J.", role: "Organic Farmer", quote: "The scanning is incredibly fast. Helped me save my entire crop of tomato plants last season." },
              { name: "Michael L.", role: "Hobbyist", quote: "No more leaf-reading and guessing. PlantAI is my clinical lab in my pocket." },
              { name: "Chen W.", role: "Botanist", quote: "The dataset used here is scientifically robust. Impressive precision on rare pest symptoms." }
            ].map((user, i) => (
              <div key={i} className="flex-none w-[320px] md:w-[450px] snap-center glass-card p-10 rounded-[2.5rem] border-slate-100 shadow-sm">
                <div className="flex space-x-2 text-primary mb-6">
                  {[1,2,3,4,5].map(s => <svg key={s} xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">"{user.quote}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                  <div>
                    <p className="font-black text-slate-900">{user.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern High-Impact CTA */}
      <section className="py-16 bg-mesh relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="glass-card-dark p-10 md:p-16 rounded-[3rem] text-center max-w-5xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/20 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">Your plants deserve the <span className="text-primary">best care.</span></h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">Start your first health scan today and join the community of 50,000+ happy plant parents.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/signup" className="btn btn-primary text-lg px-12 py-5">
                Join PlantAI Free
              </Link>
              <Link to="/forum" className="btn border border-slate-700 text-white text-lg px-12 py-5 hover:bg-slate-800">
                Browse Forum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Bottom Footer */}
      <footer className="footer bg-white border-t border-slate-100 py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="text-2xl font-black text-gradient flex items-center space-x-2 mb-6">
              <span>🌿</span>
              <span>PlantAI</span>
            </Link>
            <p className="text-slate-500 max-w-sm mb-8">Empowering the world to grow healthier plants through accessible, state-of-the-art diagnostic AI.</p>
            <div className="flex space-x-6 text-slate-400">
              {['facebook', 'twitter', 'instagram'].map(platform => (
                <a key={platform} href={`#${platform}`} className="hover:text-primary transition-colors">
                  <div className="w-6 h-6 bg-current rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.1em] text-xs">Resources</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.1em] text-xs">Download</h4>
            <div className="space-y-4">
              <button className="w-full glass-card border-slate-100 rounded-xl px-6 py-3 flex items-center justify-center space-x-3 hover:shadow-md transition-shadow">
                <span className="text-xs font-black text-slate-800 uppercase">App Store</span>
              </button>
              <button className="w-full glass-card border-slate-100 rounded-xl px-6 py-3 flex items-center justify-center space-x-3 hover:shadow-md transition-shadow">
                <span className="text-xs font-black text-slate-800 uppercase">Play Store</span>
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-400">
          <p>&copy; {new Date().getFullYear()} PlantAI Technology Group. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="#cookies" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
