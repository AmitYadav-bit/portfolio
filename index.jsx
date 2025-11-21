import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Download, 
  ExternalLink, 
  ChevronDown, 
  Code, 
  Database, 
  Bot, 
  Cpu,
  GraduationCap,
  Menu,
  X,
  MessageSquare,
  Send,
  Sparkles,
  Loader,
  RefreshCw,
  Zap,
  Phone
} from 'lucide-react';

// --- Resume Data Context for Gemini ---
// Updated with exact details from AmitAiresume.pdf
const RESUME_DATA = `
Name: Amit Yadav
Phone: +91-8881878721
Role: Data Analytics & AI Automation Specialist
Email: amit.workyadav@gmail.com
Links: linkedin.com/in/amitydv1103, github.com/AmitYadav-bit
Education: B.Tech Electrical Engineering, Madan Mohan Malaviya University of Technology (Nov 2021 - May 2025).
Experience:
1. Deloitte Australia (Virtual Intern, May-July 2025): Data Analytics. Improved data quality by 98%. Identified 20% sales drop. Used Data Cleaning, Statistical Analysis.
2. Northern Eastern Railway (Intern, June-Aug 2024): Monitored 50+ sensors, enhanced fault detection by 30%. Root cause analysis of power surges.
Projects:
1. AI-Powered Telegram Bot (@amittydvvbot): Python, n8n, Claude Sonnet 4. 95% query resolution. 100+ daily users. 200ms latency.
2. AI Voice Calling Assistant: n8n, Voice APIs. 92% success rate. Automates 15 hours/month. 88% intent accuracy.
3. Pharmaceutical Sales Dashboard: Power BI, SQL, ETL. Analyzed 20k+ transactions. Reduced reporting time 7 days -> 1 day.
Skills: Python, SQL, Power BI, Excel, n8n, AI Agents, Chatbots, Webhooks, Docker, Git, Postman, ETL Pipelines, Django, Claude API.
Soft Skills: Leadership (NSS Volunteer), Problem Solving, Communication.
`;

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // --- AI Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', text: "Hi! I'm Amit's AI Assistant. Ask me anything about his projects, skills, or experience! ✨" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // --- AI Pitch Generator State ---
  const [pitch, setPitch] = useState("");
  const [isPitchLoading, setIsPitchLoading] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Gemini API Helper ---
  const callGemini = async (prompt, systemInstruction) => {
    const apiKey = ""; // Provided by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response right now.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having trouble connecting to my brain right now. Please try again later!";
    }
  };

  // --- Feature 1: AI Chat Logic ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    const systemPrompt = `You are a helpful, professional, and enthusiastic AI assistant for Amit Yadav. 
    Use the following Resume Context to answer questions about Amit. 
    RESUME CONTEXT: ${RESUME_DATA}
    
    Rules:
    1. Keep answers concise (max 3 sentences).
    2. Be friendly and professional.
    3. If asked about something not in the resume, politely say you don't have that info but suggest contacting Amit directly.
    4. Use emojis occasionally to keep it engaging.`;

    const response = await callGemini(userMsg, systemPrompt);
    
    setChatMessages(prev => [...prev, { role: 'system', text: response }]);
    setIsChatLoading(false);
  };

  // --- Feature 2: Pitch Generator Logic ---
  const generatePitch = async () => {
    setIsPitchLoading(true);
    const systemPrompt = `You are a creative copywriter. Generate a single, punchy, 1-sentence "Why Hire Me" value proposition for Amit Yadav based on this data: ${RESUME_DATA}. 
    Focus on a different combination of skills each time (e.g., Engineering + AI, or Data + Business Insights). Start with a sparkle emoji.`;
    
    const response = await callGemini("Generate a unique value prop now.", systemPrompt);
    setPitch(response);
    setIsPitchLoading(false);
  };

  const NavLink = ({ id, label }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
        activeSection === id 
          ? 'text-cyan-400' 
          : 'text-slate-300 hover:text-cyan-400'
      }`}
    >
      {label}
    </button>
  );

  const MobileNavLink = ({ id, label }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`block w-full text-left px-6 py-4 text-base font-medium border-l-4 transition-colors duration-300 ${
        activeSection === id 
          ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' 
          : 'border-transparent text-slate-400 hover:bg-slate-800/30'
      }`}
    >
      {label}
    </button>
  );

  const SkillCard = ({ icon: Icon, title, skills }) => (
    <div className="group relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300 border border-slate-600">
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-slate-700/50 border border-slate-600 text-slate-300 text-xs rounded-full font-medium group-hover:border-cyan-500/30 group-hover:text-cyan-100 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ title, description, tags, stats, type }) => (
    <div className="group relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col h-full hover:-translate-y-1">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      <div className="p-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <Zap size={12} /> {type}
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {title}
            </h3>
          </div>
          <div className="p-2 bg-slate-700/50 rounded-full text-slate-400 group-hover:text-white group-hover:bg-cyan-600 transition-all">
            <ExternalLink size={18} />
          </div>
        </div>
        
        <p className="text-slate-300 mb-6 text-sm leading-relaxed flex-1">
          {description}
        </p>

        {stats && (
          <div className="mb-6 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <ul className="space-y-2">
              {stats.map((stat, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start">
                  <span className="mr-2 text-cyan-500 mt-0.5">▹</span> {stat}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-medium text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const ExperienceItem = ({ role, company, date, description }) => (
    <div className="relative pl-8 pb-12 last:pb-0 group">
      <div className="absolute left-0 top-0 h-full w-px bg-slate-700 group-last:bg-transparent">
        <div className="absolute top-2 -left-1.5 w-3 h-3 rounded-full bg-slate-900 border-2 border-cyan-500 group-hover:bg-cyan-500 transition-colors"></div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{role}</h4>
        <span className="text-sm text-slate-400 font-mono">{date}</span>
      </div>
      <div className="text-purple-400 font-medium mb-3">{company}</div>
      <ul className="space-y-2">
        {description.map((item, idx) => (
          <li key={idx} className="text-slate-300 text-sm flex items-start">
            <span className="mr-2 text-cyan-500/70 mt-1.5">●</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-100 text-slate-200">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-slate-800 py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AY
              </div>
              <span>Amit<span className="text-cyan-500">.</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink id="home" label="Home" />
              <NavLink id="about" label="About" />
              <NavLink id="skills" label="Skills" />
              <NavLink id="projects" label="Projects" />
              <NavLink id="experience" label="Experience" />
              <button 
                onClick={() => scrollToSection('contact')}
                className="ml-4 px-6 py-2 bg-white text-slate-900 hover:bg-cyan-50 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Let's Connect
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-2xl">
            <div className="py-2">
              <MobileNavLink id="home" label="Home" />
              <MobileNavLink id="about" label="About" />
              <MobileNavLink id="skills" label="Skills" />
              <MobileNavLink id="projects" label="Projects" />
              <MobileNavLink id="experience" label="Experience" />
              <MobileNavLink id="contact" label="Contact" />
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-52 lg:pb-40 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-medium mb-8 shadow-lg shadow-cyan-900/20">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Available for Data Analytics & AI Roles
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
              Building Intelligence <br />
              from <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">Complex Data</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl border-l-2 border-slate-700 pl-6">
              Hi, I'm <span className="text-white font-semibold">Amit Yadav</span>. 
              I bridge the gap between Electrical Engineering and AI, creating automated systems that turn raw numbers into strategic decisions.
            </p>

            {/* Gemini Feature: Pitch Generator */}
            <div className="mb-10 p-1 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl max-w-xl border border-slate-700/50">
               <div className="bg-slate-950/50 rounded-xl p-4 backdrop-blur-sm">
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl text-white shadow-lg">
                     <Sparkles size={20} />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-2">
                       <h4 className="text-sm font-bold text-white">AI Insights Generator</h4>
                       <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Powered by Gemini</span>
                     </div>
                     <p className="text-sm text-slate-300 italic mb-4 min-h-[40px] leading-relaxed">
                       {isPitchLoading ? "Analyzing resume patterns..." : (pitch || "Click the button to generate a unique 'Why Hire Me' pitch based on my real-time resume data.")}
                     </p>
                     <button 
                       onClick={generatePitch}
                       disabled={isPitchLoading}
                       className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-2"
                     >
                       {isPitchLoading ? <Loader size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                       {pitch ? "Generate Another" : "Generate Insight"}
                     </button>
                   </div>
                 </div>
               </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => scrollToSection('projects')}
                className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-cyan-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center hover:-translate-y-1"
              >
                Explore Projects <ChevronDown size={18} className="ml-2" />
              </button>
              
              {/* RESUME DOWNLOAD BUTTON */}
              <a 
                href="/AmitAiresume.pdf" 
                download="AmitAiresume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent text-white border border-slate-600 rounded-full font-medium hover:bg-slate-800 hover:border-slate-500 transition-all flex items-center group"
              >
                <Download size={18} className="mr-2 group-hover:text-cyan-400 transition-colors" /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Quick Info */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Projects Delivered', value: '10+' },
              { label: 'Data Quality Boost', value: '98%' },
              { label: 'Hours Saved/Mo', value: '15+' },
              { label: 'Location', value: 'India (Remote)' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center md:text-left group cursor-default">
                <div className="text-4xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{stat.value}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Technical Arsenal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A robust stack built for scaling data pipelines and automating intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard 
              icon={Code}
              title="Programming"
              skills={['Python', 'SQL', 'JavaScript', 'Django', 'HTML/CSS']}
            />
            <SkillCard 
              icon={Database}
              title="Data Stack"
              skills={['Power BI', 'Excel', 'Tableau', 'Matplotlib', 'Seaborn', 'ETL']}
            />
            <SkillCard 
              icon={Bot}
              title="AI & Agents"
              skills={['n8n', 'Claude Sonnet 4', 'LLMs', 'Webhooks', 'Voice APIs']}
            />
            <SkillCard 
              icon={Cpu}
              title="DevOps & Tools"
              skills={['Git', 'Docker', 'Postman', 'PostgreSQL', 'VS Code']}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Work</h2>
              <p className="text-slate-400 max-w-xl text-lg">
                Where engineering meets business intelligence.
              </p>
            </div>
            <a href="https://github.com/AmitYadav-bit" target="_blank" rel="noreferrer" className="hidden md:flex items-center text-cyan-400 font-medium hover:text-cyan-300 mt-4 md:mt-0 transition-colors">
              View GitHub <ExternalLink size={16} className="ml-2" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              type="Automation"
              title="AI Telegram Bot"
              description="Intelligent bot (@amittydvvbot) architected with n8n and Claude Sonnet 4. Handles complex queries with context awareness and webhook integration."
              stats={[
                "95% resolution rate",
                "200ms latency",
                "100+ daily users"
              ]}
              tags={['Python', 'n8n', 'Claude Sonnet 4', 'Webhooks']}
            />
            <ProjectCard 
              type="Voice AI"
              title="Voice Calling Assistant"
              description="Voice-enabled assistant connecting 8 different API services. Recognizes intent (88% accuracy) and routes calls autonomously."
              stats={[
                "92% success rate",
                "15h manual work saved",
                "< 3s latency"
              ]}
              tags={['n8n', 'Voice APIs', 'LLM', 'JSON']}
            />
            <ProjectCard 
              type="Analytics"
              title="Pharma Sales Dashboard"
              description="Power BI dashboard analyzing 20k+ transactions. Engineered ETL pipelines to integrate multiple SQL data sources."
              stats={[
                "Reporting: 7 days → 1 day",
                "Found 12% growth opps",
                "Drill-down views"
              ]}
              tags={['Power BI', 'SQL', 'ETL', 'Excel']}
            />
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <a href="https://github.com/AmitYadav-bit" className="inline-flex items-center text-cyan-400 font-medium hover:text-cyan-300">
              View GitHub <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Journey</h2>
            <p className="text-slate-400">
              From Electrical Engineering to Data Science leadership.
            </p>
          </div>

          <div className="bg-slate-800/50 p-8 md:p-12 rounded-3xl border border-slate-700 backdrop-blur-md shadow-2xl">
            <ExperienceItem 
              role="Data Analytics Virtual Intern"
              company="Deloitte Australia"
              date="Nov 2021 - May 2025"
              description={[
                "Transformed messy datasets by removing null values and restructuring columns, improving data quality by 98%.",
                "Delivered insights identifying a 20% sales drop in specific regions, providing strategic recommendations.",
                "Applied advanced data cleaning and statistical analysis to support business decision-making."
              ]}
            />
            <div className="h-12 border-l border-slate-700 ml-8 my-2"></div>
            <ExperienceItem 
              role="Summer Intern"
              company="Northern Eastern Railway"
              date="June 2024 - August 2024"
              description={[
                "Monitored integration of 50+ bearing condition sensors, enhancing fault detection by 30%.",
                "Investigated three common causes of power surges using root cause analysis, preventing 10 potential failures.",
                "Implemented predictive maintenance strategies through sensor data analysis."
              ]}
            />
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="about" className="py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6 text-indigo-200">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <GraduationCap size={24} />
                  </div>
                  <span className="font-bold uppercase tracking-wider text-sm">Education Background</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Bachelor of Technology</h3>
                <p className="text-2xl text-indigo-100 mb-2 font-light">Electrical Engineering</p>
                <p className="text-indigo-200/80">Madan Mohan Malaviya University of Technology</p>
                <p className="text-indigo-200/60 text-sm mt-1">Gorakhpur, India • 2021 - 2025</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 max-w-sm w-full hover:bg-white/15 transition-colors">
                <h4 className="font-bold text-lg mb-4 border-b border-white/10 pb-2">Key Achievements</h4>
                <ul className="space-y-3 text-sm text-indigo-50">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                    <span>Tata Data Visualization Certificate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                    <span>NSS Volunteer Leader (2022-2024)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2"></div>
                    <span>Coordinated 3+ community donation drives</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500 opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-3 rounded-full bg-slate-800 mb-6">
            <Mail size={24} className="text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Collaborate?</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg">
            I'm actively looking for full-time roles. Whether you have a question or just want to say hi, my inbox is always open.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a href="mailto:amit.workyadav@gmail.com" className="group flex flex-col items-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all hover:-translate-y-1">
              <span className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">Email</span>
              <span className="text-slate-400 text-sm">amit.workyadav@gmail.com</span>
            </a>
            
            <div className="group flex flex-col items-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all hover:-translate-y-1 cursor-pointer">
              <Phone size={24} className="text-cyan-400 mb-4" />
              <span className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">Phone</span>
              <span className="text-slate-400 text-sm">+91-8881878721</span>
            </div>

            <a href="https://linkedin.com/in/amitydv1103" target="_blank" rel="noreferrer" className="group flex flex-col items-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all hover:-translate-y-1">
              <span className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">LinkedIn</span>
              <span className="text-slate-400 text-sm">Connect professionally</span>
            </a>
          </div>
        </div>
      </section>

      {/* Gemini Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-80 md:w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3 text-white">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Amit's AI Assistant</h3>
                  <span className="text-indigo-100 text-[10px] flex items-center gap-1 opacity-80">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-950 min-h-[300px] scrollbar-thin scrollbar-thumb-slate-700">
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about skills..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 transition-all"
              />
              <button 
                type="submit" 
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`group p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border border-white/10 ${
            isChatOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-110'
          }`}
        >
          {isChatOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <>
              <MessageSquare size={24} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white tracking-tight">Amit Yadav</span>
            <p className="text-sm mt-1">Building the future with Data & AI.</p>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} Amit Yadav. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
