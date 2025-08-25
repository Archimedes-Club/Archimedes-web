// import React, { JSX, useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import "../styles/PublicProjectDetails.css";

// Project data interface
// interface ProjectData {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   author: string;
//   role: string;
//   image: string;
//   status: string;
//   categoryColor: string;
//   startDate?: string;
//   duration?: string;
//   budget?: string;
//   teamSize?: number;
//   partners?: number;
//   overview?: string;
//   results?: string[];
//   achievements?: Array<{
//     icon: string;
//     title: string;
//     description: string;
//   }>;
//   teamMembers?: Array<{
//     initials: string;
//     name: string;
//     role: string;
//   }>;
//   resources?: Array<{
//     icon: string;
//     title: string;
//     description: string;
//   }>;
// }

// Sample detailed project data - In a real app, this would come from an API
// const projectsData: Record<number, ProjectData> = {
//   1: {
//     id: 1,
//     title:
//       "Application of Artificial Intelligence in Emergency Medicine (AIEM)",
//     description:
//       "The goal of this project is to develop an AI-based decision support system for rapid diagnosis and treatment plans in medical emergencies.",
//     category: "Healthcare AI",
//     author: "Dr. Sergey Afyan",
//     role: "Project Lead",
//     image:
//       "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     status: "Active",
//     categoryColor: "#ff6b9d",
//     startDate: "January 2024",
//     duration: "24 months",
//     budget: "$1.2M",
//     teamSize: 15,
//     partners: 3,
//     overview: `The Application of Artificial Intelligence in Emergency Medicine (AIEM) project represents a groundbreaking initiative at the intersection of healthcare and artificial intelligence. This collaborative effort between NEU AI Hub and Italian medical emergency services aims to revolutionize how medical emergencies are diagnosed and treated.

// Our AI-based decision support system leverages advanced machine learning algorithms to analyze patient symptoms, medical history, and real-time vital signs to provide rapid, accurate diagnostic suggestions and treatment recommendations. This technology has the potential to significantly reduce response times in critical situations and improve patient outcomes.`,
//     results: [
//       "35% reduction in average diagnosis time for critical conditions",
//       "92% accuracy in predicting optimal treatment pathways",
//       "28% improvement in patient satisfaction scores",
//       "Successfully processed over 10,000 emergency cases in pilot hospitals",
//       "Identified 15 rare conditions that were initially misdiagnosed",
//     ],
//     achievements: [
//       {
//         icon: "🥇",
//         title: "IEEE Medical AI Award",
//         description:
//           "Recognized for outstanding contribution to AI applications in healthcare at the 2024 IEEE Conference",
//       },
//       {
//         icon: "📜",
//         title: "FDA Breakthrough Designation",
//         description:
//           "Received FDA Breakthrough Device designation for innovative emergency diagnostic capabilities",
//       },
//       {
//         icon: "🌟",
//         title: "Nature Medicine Publication",
//         description:
//           "Research findings published in Nature Medicine journal with over 500 citations",
//       },
//     ],
//     teamMembers: [
//       { initials: "SA", name: "Dr. Sergey Afyan", role: "Project Lead" },
//       { initials: "MR", name: "Dr. Maria Rossi", role: "Medical Director" },
//       { initials: "JC", name: "Dr. James Chen", role: "AI Research Lead" },
//       {
//         initials: "LB",
//         name: "Dr. Luigi Bianchi",
//         role: "Emergency Medicine Expert",
//       },
//     ],
//     resources: [
//       {
//         icon: "📄",
//         title: "AI-Driven Emergency Triage: A Comprehensive Study",
//         description: "Published in Nature Medicine, 2024",
//       },
//       {
//         icon: "🎥",
//         title: "AIEM System Demo Video",
//         description: "Watch our 5-minute system demonstration",
//       },
//       {
//         icon: "📊",
//         title: "Technical Documentation",
//         description: "Complete API and integration guidelines",
//       },
//       {
//         icon: "🔬",
//         title: "Research Dataset",
//         description: "Anonymized emergency case data (upon request)",
//       },
//     ],
//   },
//   2: {
//     id: 2,
//     title: "Freeway Traffic Modeling and Optimization",
//     description:
//       "Develop mathematical model, AI-based computer simulation software, and conduct optimization to achieve better road throughput and reduce accident rate.",
//     category: "Transportation AI",
//     author: "Dr. Sergey Afyan",
//     role: "Project Lead",
//     image:
//       "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//     status: "Active",
//     categoryColor: "#ffa726",
//     startDate: "March 2024",
//     duration: "18 months",
//     budget: "$800K",
//     teamSize: 12,
//     partners: 2,
//     overview: `The Freeway Traffic Modeling and Optimization project aims to revolutionize urban transportation through advanced AI and mathematical modeling. By developing sophisticated simulation software, we're working to optimize traffic flow, reduce congestion, and minimize accident rates on major highways.

// Our approach combines real-time traffic data analysis, predictive modeling, and machine learning algorithms to create dynamic traffic management solutions that adapt to changing conditions throughout the day.`,
//     results: [
//       "25% reduction in average commute times during peak hours",
//       "40% decrease in accident rates at optimized intersections",
//       "15% improvement in overall road throughput capacity",
//       "Successfully implemented in 5 major metropolitan areas",
//       "Reduced carbon emissions by 18% through optimized traffic flow",
//     ],
//     achievements: [
//       {
//         icon: "🏆",
//         title: "Smart Cities Innovation Award",
//         description:
//           "Recognized for excellence in urban mobility solutions at the 2024 Smart Cities Expo",
//       },
//       {
//         icon: "🌍",
//         title: "Environmental Impact Recognition",
//         description:
//           "Awarded for significant reduction in transportation-related emissions",
//       },
//       {
//         icon: "📚",
//         title: "Transportation Research Board Publication",
//         description:
//           "Featured research in the annual TRB conference proceedings",
//       },
//     ],
//     teamMembers: [
//       { initials: "SA", name: "Dr. Sergey Afyan", role: "Project Lead" },
//       {
//         initials: "TW",
//         name: "Dr. Thomas Wang",
//         role: "Traffic Systems Expert",
//       },
//       { initials: "RP", name: "Dr. Rachel Park", role: "Data Science Lead" },
//       { initials: "MG", name: "Michael Green", role: "Simulation Engineer" },
//     ],
//     resources: [
//       {
//         icon: "📈",
//         title: "Traffic Flow Optimization Models",
//         description: "Comprehensive documentation of our mathematical models",
//       },
//       {
//         icon: "🖥️",
//         title: "Simulation Software Demo",
//         description:
//           "Interactive demonstration of our traffic simulation system",
//       },
// {
//   icon: "📑",
//   title: "Implementation Guide",
//   description: "Step-by-step guide for city planners and engineers",
// },
// {
//   icon: "📊",
//   title: "Performance Metrics Dashboard",
//   description: "Real-time analytics and performance indicators",
// },
//     ],
//   },
//   3: {
//     id: 3,
//     title: "Interactive Web Portal for Archimedes Club",
//     description:
//       "Develop interactive web portal/social media to allow Archimedes Club members to build research teams and communicate their projects.",
//     category: "Web Development",
//     author: "Prof. Rolando Herrero",
//     role: "Project Lead",
//     image:
//       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//     status: "Active",
//     categoryColor: "#9c27b0",
//     startDate: "February 2024",
//     duration: "12 months",
//     budget: "$500K",
//     teamSize: 8,
//     partners: 1,
//     overview: `The Interactive Web Portal project is creating a comprehensive digital platform for the Archimedes Club community. This innovative system enables researchers, students, and faculty to collaborate seamlessly, share their work, and form interdisciplinary research teams.

// Built with modern web technologies, the portal features real-time collaboration tools, project management capabilities, and social networking features specifically designed for academic research environments.`,
//     results: [
//       "500+ active researchers registered in the first 3 months",
//       "150+ research projects successfully launched through the platform",
//       "85% user satisfaction rate based on feedback surveys",
//       "30+ interdisciplinary collaborations formed",
//       "Reduced project coordination time by 45%",
//     ],
//     achievements: [
//       {
//         icon: "💻",
//         title: "EdTech Innovation Award",
//         description:
//           "Recognized for excellence in educational technology at the 2024 EdTech Summit",
//       },
//       {
//         icon: "🤝",
//         title: "Collaboration Platform of the Year",
//         description: "Awarded by the Academic Technology Association",
//       },
//       {
//         icon: "🎨",
//         title: "Best UI/UX Design",
//         description: "Winner of the University Web Design Competition 2024",
//       },
//     ],
//     teamMembers: [
//       { initials: "RH", name: "Prof. Rolando Herrero", role: "Project Lead" },
//       { initials: "ES", name: "Emily Smith", role: "Lead Developer" },
//       { initials: "JL", name: "Jason Liu", role: "UI/UX Designer" },
//       { initials: "AK", name: "Anna Kumar", role: "Backend Engineer" },
//     ],
//     resources: [
//       {
//         icon: "🔧",
//         title: "Platform User Guide",
//         description: "Comprehensive guide for all platform features",
//       },
//       {
//         icon: "📱",
//         title: "Mobile App Documentation",
//         description: "Guide for iOS and Android applications",
//       },
//       {
//         icon: "🔌",
//         title: "API Documentation",
//         description: "Developer resources for platform integration",
//       },
//       {
//         icon: "📹",
//         title: "Video Tutorials",
//         description: "Step-by-step video guides for common tasks",
//       },
//     ],
//   },
//   4: {
//     id: 4,
//     title: "Refractory Neural Networks",
//     description:
//       "A new model for neurons which is closer to natural neurons. Explore the concept of refractory time more rigorously than traditional neural models.",
//     category: "Neural Networks",
//     author: "Dr. Sergey Afyan",
//     role: "Project Lead",
//     image:
//       "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//     status: "Research",
//     categoryColor: "#3f51b5",
//     startDate: "May 2024",
//     duration: "36 months",
//     budget: "$1.5M",
//     teamSize: 10,
//     partners: 4,
//     overview: `The Refractory Neural Networks project represents a fundamental advancement in artificial neural network design. By incorporating biological refractory periods into artificial neurons, we're creating models that more accurately mimic the behavior of natural neural systems.

// This research has implications for improving AI systems' efficiency, reducing computational requirements, and creating more robust learning algorithms that better reflect biological intelligence.`,
//     results: [
//       "30% improvement in energy efficiency compared to traditional neural networks",
//       "Enhanced temporal pattern recognition capabilities",
//       "Reduced training time by 25% for complex tasks",
//       "Published 3 peer-reviewed papers in top-tier journals",
//       "Developed novel mathematical framework for refractory dynamics",
//     ],
//     achievements: [
//       {
//         icon: "🧠",
//         title: "Breakthrough Research Award",
//         description: "Recognized by the International Neural Network Society",
//       },
//       {
//         icon: "📖",
//         title: "Best Paper Award",
//         description:
//           "NeurIPS 2024 Conference Best Paper in Neural Architecture",
//       },
//       {
//         icon: "🔬",
//         title: "NSF Research Grant",
//         description:
//           "Awarded $500K National Science Foundation grant for continued research",
//       },
//     ],
//     teamMembers: [
//       { initials: "SA", name: "Dr. Sergey Afyan", role: "Project Lead" },
//       {
//         initials: "YZ",
//         name: "Dr. Yuki Zhang",
//         role: "Neural Network Architect",
//       },
//       {
//         initials: "MP",
//         name: "Dr. Michael Patel",
//         role: "Computational Neuroscientist",
//       },
//       { initials: "SG", name: "Sarah Goldman", role: "Research Engineer" },
//     ],
//     resources: [
//       {
//         icon: "📚",
//         title: "Refractory Neural Networks: Theory and Practice",
//         description: "Comprehensive textbook on RNN architecture",
//       },
//       {
//         icon: "💻",
//         title: "Open Source Implementation",
//         description: "GitHub repository with PyTorch implementation",
//       },
//       {
//         icon: "📐",
//         title: "Mathematical Proofs",
//         description: "Formal proofs of convergence and stability",
//       },
//       {
//         icon: "🧪",
//         title: "Experimental Results",
//         description: "Detailed benchmark comparisons and datasets",
//       },
//     ],
//   },
//   5: {
//     id: 5,
//     title: "Cognitive Human Reaction Time Research",
//     description:
//       "Measure and explain human reaction time mechanisms. Logical extension of Stroop's experiment with mathematical modeling.",
//     category: "Cognitive Psychology",
//     author: "Dr. Sergey Afyan",
//     role: "Project Lead",
//     image:
//       "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//     status: "Planning",
//     categoryColor: "#795548",
//     startDate: "September 2024",
//     duration: "24 months",
//     budget: "$600K",
//     teamSize: 6,
//     partners: 2,
//     overview: `The Cognitive Human Reaction Time Research project extends classical psychological experiments into the modern era. Building on Stroop's foundational work, we're developing sophisticated mathematical models to explain and predict human reaction times under various cognitive loads.

// Our research combines experimental psychology, neuroscience, and advanced statistical modeling to unlock new insights into human cognitive processing and decision-making.`,
//     results: [
//       "Developed new experimental paradigm with 95% reliability",
//       "Created predictive model with 88% accuracy",
//       "Identified 3 new factors affecting reaction time",
//       "Collected data from 1,000+ participants",
//       "Established new baseline metrics for cognitive assessment",
//     ],
//     achievements: [
//       {
//         icon: "🎯",
//         title: "Cognitive Science Innovation Award",
//         description:
//           "Recognized for advancing experimental psychology methodology",
//       },
//       {
//         icon: "📊",
//         title: "Best Poster Presentation",
//         description: "Cognitive Science Society Annual Meeting 2024",
//       },
//       {
//         icon: "🏅",
//         title: "Research Excellence Grant",
//         description: "Awarded by the Department of Psychology",
//       },
//     ],
//     teamMembers: [
//       { initials: "SA", name: "Dr. Sergey Afyan", role: "Project Lead" },
//       { initials: "LC", name: "Dr. Lisa Chen", role: "Cognitive Psychologist" },
//       { initials: "RB", name: "Dr. Robert Brown", role: "Statistician" },
//       { initials: "KJ", name: "Kelly Johnson", role: "Research Coordinator" },
//     ],
//     resources: [
//       {
//         icon: "📝",
//         title: "Experimental Protocol",
//         description: "Detailed methodology for reaction time studies",
//       },
//       {
//         icon: "🎮",
//         title: "Interactive Test Suite",
//         description: "Web-based cognitive testing platform",
//       },
//       {
//         icon: "📈",
//         title: "Statistical Analysis Tools",
//         description: "R packages for reaction time analysis",
//       },
//       {
//         icon: "📔",
//         title: "Research Findings Report",
//         description: "Comprehensive report on cognitive mechanisms",
//       },
//     ],
//   },
// };

// const PublicProjectDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [project, setProject] = useState<ProjectData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call to fetch project details
//     const fetchProject = () => {
//       const projectId = parseInt(id || "1");
//       const projectData = projectsData[projectId];

//       if (projectData) {
//         setProject(projectData);
//       } else {
//         // Redirect to home if project not found
//         navigate("/");
//       }
//       setLoading(false);
//     };

// Add small delay to simulate loading
//   setTimeout(fetchProject, 300);
// }, [id, navigate]);

// useEffect(() => {
//   if (project) {
//     document.title = `${project.title} - Archimedes Portal`;
//   }
// }, [project]);

// Category icon mapping
// const getCategoryIcon = (category: string) => {
//   const icons: Record<string, JSX.Element> = {
//     "Healthcare AI": (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//       </svg>
//     ),
//     "Transportation AI": (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M3 17a2 2 0 002 2h14a2 2 0 002-2v-3H3v3zM3 12h18V7a2 2 0 00-2-2H5a2 2 0 00-2 2v5z" />
//         <path d="M8 21v-2M16 21v-2" />
//       </svg>
//     ),
//     "Web Development": (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
//         <path d="M12 11l4 4-4 4-4-4z" />
//       </svg>
//     ),
//     "Neural Networks": (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//         <circle cx="12" cy="12" r="3" />
//         <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
//         <path d="M20.5 7.5L16 12l4.5 4.5M3.5 7.5L8 12l-4.5 4.5" />
//       </svg>
//     ),
//     "Cognitive Psychology": (
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//         <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
//         <path d="M12 6v6l4 2" />
//       </svg>
//     ),
//   };
//   return icons[category] || null;
// };

// if (loading) {
//   return (
//     <div className="public-loading-container">
//       <div className="public-loading-spinner"></div>
//     </div>
//   );
// }

// if (!project) {
//   return null;
// }

// return (
//   <div className="public-project-details-container">
//     {/* Header */}
//     <header className="public-header">
//       <Link to="/" className="public-logo">
//         <img
//           src="/image/pi.png"
//           alt="Pi symbol"
//           className="public-logo-icon-img"
//         />
//         Archimedes Portal
//       </Link>
//       <nav className="public-nav">
//         <Link to="/">Home</Link>
//         <a href="/#about">About Us</a>
//         <a href="/#projects">Projects</a>
//         <Link to="/login" className="public-login-btn">
//           Login
//         </Link>
//       </nav>
//     </header>

{
  /* Project Banner */
}
// <section className="public-project-banner">
//   <div className="public-archimedes-pattern"></div>
//   <div className="public-math-grid"></div>

{
  /* Floating Mathematical Icons */
}
//   <div className="public-floating-icons">
//     <div className="public-float-icon">π</div>
//     <div className="public-float-icon">∑</div>
//     <div className="public-float-icon">∫</div>
//     <div className="public-float-icon">√</div>
//     <div className="public-float-icon">∞</div>
//   </div>

//   <div className="public-banner-content">
//     <div className="public-project-badges">
//       <div
//         className="public-banner-category"
//         style={{
//           background: `${project.categoryColor}20`,
//           borderColor: `${project.categoryColor}40`,
//         }}
//       >
//         {getCategoryIcon(project.category)}
//         {project.category}
//       </div>
//       <div className="public-banner-status" data-status={project.status}>
//         {project.status}
//       </div>
//     </div>
//     <h1 className="public-banner-title">{project.title}</h1>
//     <div className="public-banner-meta">
//       Project Lead: {project.author} | Started:{" "}
//       {project.startDate || "N/A"}
//     </div>
//   </div>
// </section>

{
  /* Main Content */
}
// <main className="public-main-content">
//   <Link to="/" className="public-back-button">
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//     >
//       <path d="M19 12H5M12 19l-7-7 7-7" />
//     </svg>
//     Back to Projects
//   </Link>

{
  /* Project Overview */
}
// <section className="public-project-section">
//   <div className="public-section-header">
//     <div className="public-section-icon">📋</div>
//     <h2 className="public-section-title">Project Overview</h2>
//   </div>
//   <div className="public-section-content">
//     {project.overview?.split("\n\n").map((paragraph, index) => (
//       <p key={index}>{paragraph}</p>
//     ))}
//   </div>

//   <div className="public-info-grid compact">
//     <div className="public-info-card">
//       <div className="public-info-label">Duration</div>
//       <div className="public-info-value">
//         {project.duration || "N/A"}
//       </div>
//     </div>
//     <div className="public-info-card">
//       <div className="public-info-label">Team Size</div>
//       <div className="public-info-value">
//         {project.teamSize || 0} researchers
//       </div>
//     </div>
//   </div>
// </section>

{
  /* Results & Outcomes */
}
// {project.results && project.results.length > 0 && (
//   <section className="public-project-section">
//     <div className="public-section-header">
//       <div className="public-section-icon">📊</div>
//       <h2 className="public-section-title">Results & Outcomes</h2>
//     </div>
//     <div className="public-section-content">
//       <p>
//         The {project.title} project has achieved remarkable results:
//       </p>
//       <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
//         {project.results.map((result, index) => (
//           <li key={index}>
//             <strong>{result}</strong>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </section>
// )}

{
  /* Achievements & Awards */
}
// {project.achievements && project.achievements.length > 0 && (
//   <section className="public-project-section">
//     <div className="public-section-header">
//       <div className="public-section-icon">🏆</div>
//       <h2 className="public-section-title">
//         Achievements & Recognition
//       </h2>
//     </div>

//     <div className="public-achievements-grid">
//       {project.achievements.map((achievement, index) => (
//         <div key={index} className="public-achievement-card">
//           <div className="public-achievement-icon">
//             {achievement.icon}
//           </div>
//           <h3 className="public-achievement-title">
//             {achievement.title}
//           </h3>
//           <p className="public-achievement-desc">
//             {achievement.description}
//           </p>
//         </div>
//       ))}
//     </div>
//   </section>
// )}

{
  /* Team Members */
}
{
  /* {project.teamMembers && project.teamMembers.length > 0 && (
          <section className="public-project-section">
            <div className="public-section-header">
              <div className="public-section-icon">👥</div>
              <h2 className="public-section-title">Research Team</h2>
            </div>

            <div className="public-team-grid">
              {project.teamMembers.map((member, index) => (
                <div key={index} className="public-team-member">
                  <div className="public-member-avatar">{member.initials}</div>
                  <h3 className="public-member-name">{member.name}</h3>
                  <p className="public-member-role">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )} */
}

{
  /* Resources & Publications */
}
//   {project.resources && project.resources.length > 0 && (
//     <section className="public-project-section">
//       <div className="public-section-header">
//         <div className="public-section-icon">📚</div>
//         <h2 className="public-section-title">Resources & Publications</h2>
//       </div>

//       <div className="public-resources-list">
//         {project.resources.map((resource, index) => (
//           <div key={index} className="public-resource-item">
//             <div className="public-resource-icon">{resource.icon}</div>
//             <div className="public-resource-text">
//               <div className="public-resource-title">
//                 {resource.title}
//               </div>
//               <div className="public-resource-desc">
//                 {resource.description}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   )}
// </main>

{
  /* Footer */
}
//       <footer className="public-footer">
//         <div className="public-footer-content">
//           <div className="public-footer-section public-brand">
//             <div className="public-footer-logo">
//               <div className="public-footer-logo-icon">π</div>
//               <div>
//                 <h3>Archimedes Portal</h3>
//                 <span className="public-tagline">Research Hub</span>
//               </div>
//             </div>
//             <p className="public-brand-description">
//               Empowering researchers worldwide to collaborate, innovate, and
//               advance human knowledge through cutting-edge research and
//               technology.
//             </p>
//           </div>

//           <div className="public-footer-section">
//             <h4>Community</h4>
//             <ul>
//               <li>
//                 <a href="/join">Join Network</a>
//               </li>
//               <li>
//                 <a href="/newsletter">Newsletter</a>
//               </li>
//             </ul>
//           </div>

//           <div className="public-footer-section">
//             <h4>Contact</h4>
//             <div className="public-contact-info">
//               <div className="public-contact-item">
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                   <polyline
//                     points="22,6 12,13 2,6"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//                 <span>contact@archimedes.edu</span>
//               </div>
//               <div className="public-contact-item">
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                   <circle
//                     cx="12"
//                     cy="10"
//                     r="3"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//                 <span>Oakland, CA</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="public-footer-bottom">
//           <p>© 2025 Archimedes Portal. All rights reserved.</p>
//           <div className="public-footer-links">
//             <a href="/privacy">Privacy Policy</a>
//             <a href="/terms">Terms of Service</a>
//             <a href="/accessibility">Accessibility</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PublicProjectDetails;
