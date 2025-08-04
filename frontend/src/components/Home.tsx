// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { Link as ScrollLink, Element } from "react-scroll";
// import "../styles/LandingPage.css";

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { userData } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     if (userData) {
//       navigate("/dashboard");
//     }
//   }, [userData, navigate]);

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   useEffect(() => {
//     document.title = "Archimedes Club";
//   }, []);

//   // Carousel data
//   const carouselSlides = [
//     {
//       id: 1,
//       title: "Welcome to Archimedes Club",
//       subtitle:
//         "Bridging Innovation and Education Through Collaborative Research",
//       description:
//         "Join our community of researchers, students, and faculty working together to solve real-world challenges through cutting-edge technology and interdisciplinary collaboration.",
//       image:
//         "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//     },
//     {
//       id: 2,
//       title: "Featured Research Projects",
//       subtitle: "Groundbreaking AI Solutions for Emergency Medicine",
//       description:
//         "Discover our flagship project developing AI-based decision support systems for rapid diagnosis and treatment plans in medical emergencies, a collaboration with NEU AI Hub and Italian medical services.",
//       image:
//         "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//     },
//     {
//       id: 3,
//       title: "Research Focus Areas",
//       subtitle: "Advancing Multiple Disciplines Through Technology",
//       description:
//         "From Healthcare AI and Neural Networks to Transportation Optimization and Cognitive Psychology - explore our diverse portfolio of research categories driving innovation across industries.",
//       image:
//         "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
//     },
//   ];

//   // Auto-advance carousel
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
//     }, 8000);

//     return () => clearInterval(timer);
//   }, [carouselSlides.length]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide(
//       (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
//     );
//   };

//   const goToSlide = (index: number) => {
//     setCurrentSlide(index);
//   };

//   // Sample project data
//   const projects = [
//     {
//       id: 1,
//       title:
//         "Application of Artificial Intelligence in Emergency Medicine (AIEM)",
//       description:
//         "The goal of this project is to develop an AI-based decision support system for rapid diagnosis and treatment plans in medical emergencies. This is a joint project of NEU AI Hub and Italian medical emergency services, representing our most comprehensive research initiative with international collaboration.",
//       category: "Healthcare AI",
//       author: "Dr. Sergey Atiyan",
//       role: "Project Lead",
//       image:
//         "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//       status: "Active",
//       categoryColor: "#ff6b9d",
//     },
//     {
//       id: 2,
//       title: "Freeway Traffic Modeling and Optimization",
//       description:
//         "Develop mathematical model, AI-based computer simulation software, and conduct optimization to achieve better road throughput and reduce accident rate.",
//       category: "Transportation AI",
//       author: "Dr. Sergey Afyan",
//       role: "Project Lead",
//       image:
//         "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       status: "Active",
//       categoryColor: "#ffa726",
//     },
//     {
//       id: 3,
//       title: "Interactive Web Portal for Archimedes Club",
//       description:
//         "Develop interactive web portal/social media to allow Archimedes Club members to build research teams and communicate their projects.",
//       category: "Web Development",
//       author: "Prof. Rolando Herrero",
//       role: "Project Lead",
//       image:
//         "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       status: "Active",
//       categoryColor: "#9c27b0",
//     },
//     {
//       id: 4,
//       title: "Refractory Neural Networks",
//       description:
//         "A new model for neurons which is closer to natural neurons. Explore the concept of refractory time more rigorously than traditional neural models.",
//       category: "Neural Networks",
//       author: "Dr. Sergey Afyan",
//       role: "Project Lead",
//       image:
//         "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       status: "Research",
//       categoryColor: "#3f51b5",
//     },
//     {
//       id: 5,
//       title: "Cognitive Human Reaction Time Research",
//       description:
//         "Measure and explain human reaction time mechanisms. Logical extension of Stroop's experiment with mathematical modeling.",
//       category: "Cognitive Psychology",
//       author: "Dr. Sergey Afyan",
//       role: "Project Lead",
//       image:
//         "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
//       status: "Planning",
//       categoryColor: "#795548",
//     },
//   ];

//   return (
//     <div className="landing-container">
//       {/* Header */}
//       <header className="header">
//         <div className="logo">Archimedes Portal</div>
//         <div className="hamburger" onClick={toggleMenu}>
//           ☰
//         </div>
//         <nav className={`nav ${menuOpen ? "open" : ""}`}>
//           <ScrollLink
//             to="about"
//             smooth={true}
//             duration={500}
//             offset={-70}
//             className="nav-link"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </ScrollLink>
//           <ScrollLink
//             to="projects"
//             smooth={true}
//             duration={500}
//             offset={-70}
//             className="nav-link"
//             onClick={() => setMenuOpen(false)}
//           >
//             Projects
//           </ScrollLink>
//           <Link
//             to="/login"
//             className="login-btn"
//             onClick={() => setMenuOpen(false)}
//           >
//             Login
//           </Link>
//         </nav>
//       </header>

//       {/* Image Carousel Banner */}
//       <section className="carousel-banner">
//         <div className="carousel-container">
//           {carouselSlides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={`carousel-slide ${
//                 index === currentSlide ? "active" : ""
//               } ${index < currentSlide ? "prev" : ""} ${
//                 index > currentSlide ? "next" : ""
//               }`}
//             >
//               <div className="slide-image">
//                 <img src={slide.image} alt={slide.title} />
//                 <div className="slide-overlay"></div>
//               </div>
//               <div className="slide-content">
//                 <h1 className="slide-title">{slide.title}</h1>
//                 <h2 className="slide-subtitle">{slide.subtitle}</h2>
//                 <p className="slide-description">{slide.description}</p>
//               </div>
//             </div>
//           ))}

//           {/* Carousel Navigation */}
//           <button className="carousel-nav prev" onClick={prevSlide}>
//             &#8249;
//           </button>
//           <button className="carousel-nav next" onClick={nextSlide}>
//             &#8250;
//           </button>

//           {/* Carousel Indicators */}
//           <div className="carousel-indicators">
//             {carouselSlides.map((_, index) => (
//               <button
//                 key={index}
//                 className={`indicator ${
//                   index === currentSlide ? "active" : ""
//                 }`}
//                 onClick={() => goToSlide(index)}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* About Us */}
//       <Element name="about" className="about">
//         <h2>About Us</h2>
//         <p>
//           Archimedes is an informal{" "}
//           <b>Multideisciplinary Student Research Club </b> at Northeastern
//           University located on the Oakland campus. Archimedes welcomes students
//           from all the NEU campuses, colleges, schools and departments- all who
//           are interested in conducting research as volunteers. we welcome
//           faculty and staff who are willing to supervise, lead, and help
//           students in their research
//         </p>

//         {/* Mission & Vision Cards */}
//         <div className="cards-container">
//           <div className="card" id="mission">
//             <div className="card-icon mission-icon">
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <circle
//                   cx="12"
//                   cy="12"
//                   r="3"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <path
//                   d="M12 1v6m0 6v6m11-7h-6m-6 0H1"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//               </svg>
//             </div>
//             <h3>Our Mission</h3>
//             <p>
//               Empowering knowledge sharing and collaborative learning through
//               digital solutions.
//             </p>
//           </div>
//           <div className="card" id="vision">
//             <div className="card-icon vision-icon">
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <circle
//                   cx="9"
//                   cy="7"
//                   r="4"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <path
//                   d="M23 21v-2a4 4 0 0 0-3-3.87"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//                 <path
//                   d="M16 3.13a4 4 0 0 1 0 7.75"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />
//               </svg>
//             </div>
//             <h3>Our Vision</h3>
//             <p>
//               To be a global platform enabling interdisciplinary innovation
//               across communities.
//             </p>
//           </div>
//         </div>
//       </Element>

//       {/* Featured Projects Section - Grid Only */}
//       <Element name="projects" className="featured-projects">
//         <div className="projects-header">
//           <h2>Featured Projects</h2>
//           <p>
//             Discover groundbreaking research and innovative solutions from our
//             Archimedes Club community.
//           </p>
//         </div>

//         {/* Projects Grid */}
//         <div className="projects-grid">
//           {projects.map((project) => (
//             <div key={project.id} className="grid-project-card">
//               <div
//                 className="project-status-badge"
//                 data-status={project.status}
//               >
//                 {project.status}
//               </div>
//               <div className="grid-project-image">
//                 <img src={project.image} alt={project.title} />
//               </div>
//               <div className="grid-project-content">
//                 <div
//                   className="project-category"
//                   style={{ backgroundColor: project.categoryColor }}
//                 >
//                   {project.category}
//                 </div>
//                 <h4 className="grid-project-title">{project.title}</h4>
//                 <p className="grid-project-description">
//                   {project.description}
//                 </p>
//                 <div className="project-author">
//                   <span className="author-name">{project.author}</span>
//                 </div>
//                 <button className="learn-more-btn">Learn More →</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="view-all-container">
//           <Link to="/login" className="view-all-btn">
//             View All Projects
//           </Link>
//         </div>
//       </Element>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-section brand">
//             <div className="footer-logo">
//               <div className="logo-icon">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <rect
//                     x="3"
//                     y="3"
//                     width="18"
//                     height="18"
//                     rx="2"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                   <path
//                     d="M8 12h8M12 8v8"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </div>
//               <div>
//                 <h3>Archimedes Portal</h3>
//                 <span className="tagline">Research Hub</span>
//               </div>
//             </div>
//             <p className="brand-description">
//               Empowering researchers worldwide to collaborate, innovate, and
//               advance human knowledge through cutting-edge research and
//               technology.
//             </p>
//           </div>

//           <div className="footer-section">
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

//           <div className="footer-section">
//             <h4>Contact</h4>
//             <div className="contact-info">
//               <div className="contact-item">
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
//               <div className="contact-item">
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

//         <div className="footer-bottom">
//           <p>© 2025 Archimedes Portal. All rights reserved.</p>
//           <div className="footer-links">
//             <a href="/privacy">Privacy Policy</a>
//             <a href="/terms">Terms of Service</a>
//             <a href="/accessibility">Accessibility</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link as ScrollLink, Element } from "react-scroll";
import "../styles/LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    document.title = "Archimedes Club";
  }, []);

  // Updated carousel data with your images
  const carouselSlides = [
    {
      id: 1,
      title: "Welcome to Archimedes Club",
      subtitle:
        "Bridging Innovation and Education Through Collaborative Research",
      description:
        "Join our community of researchers, students, and faculty working together to solve real-world challenges through cutting-edge technology and interdisciplinary collaboration.",
      image:
        "https://www.shutterstock.com/image-vector/archimedes-ancient-greek-scientist-engineer-600nw-2380236281.jpg",
    },
    {
      id: 2,
      title: "Featured Research Projects",
      subtitle: "Groundbreaking AI Solutions for Emergency Medicine",
      description:
        "Discover our flagship project developing AI-based decision support systems for rapid diagnosis and treatment plans in medical emergencies, a collaboration with NEU AI Hub and Italian medical services.",
      image: "/image/eureka.jpeg",
    },
    {
      id: 3,
      title: "Research Focus Areas",
      subtitle: "Advancing Multiple Disciplines Through Technology",
      description:
        "From Healthcare AI and Neural Networks to Transportation Optimization and Cognitive Psychology - explore our diverse portfolio of research categories driving innovation across industries.",
      image: "/Archimedesbanne2.webp",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Sample project data
  const projects = [
    {
      id: 1,
      title:
        "Application of Artificial Intelligence in Emergency Medicine (AIEM)",
      description:
        "The goal of this project is to develop an AI-based decision support system for rapid diagnosis and treatment plans in medical emergencies. This is a joint project of NEU AI Hub and Italian medical emergency services, representing our most comprehensive research initiative with international collaboration.",
      category: "Healthcare AI",
      author: "Dr. Sergey Afyan",
      role: "Project Lead",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Active",
      categoryColor: "#ff6b9d",
    },
    {
      id: 2,
      title: "Freeway Traffic Modeling and Optimization",
      description:
        "Develop mathematical model, AI-based computer simulation software, and conduct optimization to achieve better road throughput and reduce accident rate.",
      category: "Transportation AI",
      author: "Dr. Sergey Afyan",
      role: "Project Lead",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      status: "Active",
      categoryColor: "#ffa726",
    },
    {
      id: 3,
      title: "Interactive Web Portal for Archimedes Club",
      description:
        "Develop interactive web portal/social media to allow Archimedes Club members to build research teams and communicate their projects.",
      category: "Web Development",
      author: "Prof. Rolando Herrero",
      role: "Project Lead",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      status: "Active",
      categoryColor: "#9c27b0",
    },
    {
      id: 4,
      title: "Refractory Neural Networks",
      description:
        "A new model for neurons which is closer to natural neurons. Explore the concept of refractory time more rigorously than traditional neural models.",
      category: "Neural Networks",
      author: "Dr. Sergey Afyan",
      role: "Project Lead",
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      status: "Research",
      categoryColor: "#3f51b5",
    },
    {
      id: 5,
      title: "Cognitive Human Reaction Time Research",
      description:
        "Measure and explain human reaction time mechanisms. Logical extension of Stroop's experiment with mathematical modeling.",
      category: "Cognitive Psychology",
      author: "Dr. Sergey Afyan",
      role: "Project Lead",
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      status: "Planning",
      categoryColor: "#795548",
    },
  ];

  // Create floating particles function
  useEffect(() => {
    const createParticle = () => {
      const aboutSection = document.querySelector(".about");
      if (!aboutSection) return;

      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 6 + "s";
      particle.style.animationDuration = Math.random() * 4 + 4 + "s";
      aboutSection.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 8000);
    };

    const interval = setInterval(createParticle, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/image/pi.png" alt="Pi symbol" className="logo-icon-img" />
          Archimedes Portal
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            offset={-70}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </ScrollLink>
          <ScrollLink
            to="projects"
            smooth={true}
            duration={500}
            offset={-70}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </ScrollLink>
          <Link
            to="/login"
            className="login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Image Carousel Banner */}
      <section className="carousel-banner">
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${
                index === currentSlide ? "active" : ""
              } ${index < currentSlide ? "prev" : ""} ${
                index > currentSlide ? "next" : ""
              }`}
            >
              {slide.id === 1 ? (
                // Simple split layout for first slide
                <div className="split-slide-layout">
                  {/* Left Content Section */}
                  <div className="split-content-left">
                    <h1 className="split-title">{slide.title}</h1>
                    <h2 className="split-subtitle">{slide.subtitle}</h2>
                    <p className="split-description">{slide.description}</p>
                    <button className="split-cta-button">
                      Join Our Research Community
                    </button>
                  </div>

                  {/* Right Image Section */}
                  <div className="split-image-right">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="split-image"
                    />
                  </div>
                </div>
              ) : slide.id === 2 ? (
                // Slide 2 - Background image from local folder
                <>
                  <div
                    className="slide-2-overlay"
                    style={{ backgroundImage: "url(/image/eureka.jpeg)" }}
                  ></div>
                  <div className="slide-content">
                    <h1 className="slide-title">{slide.title}</h1>
                    <h2 className="slide-subtitle">{slide.subtitle}</h2>
                    <p className="slide-description">{slide.description}</p>
                  </div>
                </>
              ) : (
                // Slide 3 - Background image from local folder
                <>
                  <div
                    className="slide-3-overlay"
                    style={{ backgroundImage: "url(/Archimedesbanne2.webp)" }}
                  ></div>
                  <div className="slide-content">
                    <h1 className="slide-title">{slide.title}</h1>
                    <h2 className="slide-subtitle">{slide.subtitle}</h2>
                    <p className="slide-description">{slide.description}</p>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Carousel Navigation */}
          <button className="carousel-nav prev" onClick={prevSlide}>
            &#8249;
          </button>
          <button className="carousel-nav next" onClick={nextSlide}>
            &#8250;
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Us - Creative Enhanced Version */}
      <Element name="about" className="about">
        {/* Floating Mathematical Symbols */}
        <div className="math-symbols">
          <div
            className="math-symbol"
            style={{ left: "10%", animationDelay: "0s" }}
          >
            π
          </div>
          <div
            className="math-symbol"
            style={{ left: "20%", animationDelay: "2s" }}
          >
            ∑
          </div>
          <div
            className="math-symbol"
            style={{ left: "30%", animationDelay: "4s" }}
          >
            ∆
          </div>
          <div
            className="math-symbol"
            style={{ left: "40%", animationDelay: "6s" }}
          >
            ∞
          </div>
          <div
            className="math-symbol"
            style={{ left: "50%", animationDelay: "8s" }}
          >
            ∫
          </div>
          <div
            className="math-symbol"
            style={{ left: "60%", animationDelay: "10s" }}
          >
            √
          </div>
          <div
            className="math-symbol"
            style={{ left: "70%", animationDelay: "12s" }}
          >
            α
          </div>
          <div
            className="math-symbol"
            style={{ left: "80%", animationDelay: "14s" }}
          >
            β
          </div>
          <div
            className="math-symbol"
            style={{ left: "90%", animationDelay: "16s" }}
          >
            γ
          </div>
        </div>

        <h2>About Us</h2>
        <p>
          Archimedes is an informal{" "}
          <b>Multidisciplinary Student Research Club </b> at Northeastern
          University located on the Oakland campus. Archimedes welcomes students
          from all the NEU campuses, colleges, schools and departments- all who
          are interested in conducting research as volunteers. we welcome
          faculty and staff who are willing to supervise, lead, and help
          students in their research
        </p>

        {/* Mission & Vision Cards */}
        <div className="cards-container">
          <div
            className="card"
            id="mission"
            onMouseEnter={() => {
              // Create burst effect
              const aboutSection = document.querySelector(".about");
              if (aboutSection) {
                for (let i = 0; i < 5; i++) {
                  setTimeout(() => {
                    const particle = document.createElement("div");
                    particle.className = "particle";
                    particle.style.left = Math.random() * 100 + "%";
                    particle.style.animationDelay = "0s";
                    particle.style.animationDuration = "3s";
                    aboutSection.appendChild(particle);
                    setTimeout(() => {
                      if (particle.parentNode) particle.remove();
                    }, 3000);
                  }, i * 100);
                }
              }
            }}
          >
            <div className="card-icon mission-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                  fill="currentColor"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <h3>Our Mission</h3>
            <p>
              Empowering knowledge sharing and collaborative learning through
              cutting-edge digital solutions that bridge theory and practice.
            </p>
          </div>
          <div
            className="card"
            id="vision"
            onMouseEnter={() => {
              // Create burst effect
              const aboutSection = document.querySelector(".about");
              if (aboutSection) {
                for (let i = 0; i < 5; i++) {
                  setTimeout(() => {
                    const particle = document.createElement("div");
                    particle.className = "particle";
                    particle.style.left = Math.random() * 100 + "%";
                    particle.style.animationDelay = "0s";
                    particle.style.animationDuration = "3s";
                    aboutSection.appendChild(particle);
                    setTimeout(() => {
                      if (particle.parentNode) particle.remove();
                    }, 3000);
                  }, i * 100);
                }
              }
            }}
          >
            <div className="card-icon vision-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <circle
                  cx="12"
                  cy="5"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="6"
                  cy="15"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="18"
                  cy="15"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 8v4M10 13l-2 2M14 13l2 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <h3>Our Vision</h3>
            <p>
              To be a global platform enabling interdisciplinary innovation and
              fostering breakthrough discoveries across diverse research
              communities.
            </p>
          </div>
        </div>
      </Element>

      {/* Featured Projects Section - Grid Only */}
      <Element name="projects" className="featured-projects">
        <div className="projects-header">
          <h2>Featured Projects</h2>
          <p>
            Discover groundbreaking research and innovative solutions from our
            Archimedes Club community.
          </p>
        </div>

        {/* Projects Grid - UPDATED WITH LINK */}
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="grid-project-card">
              <div
                className="project-status-badge"
                data-status={project.status}
              >
                {project.status}
              </div>
              <div className="grid-project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="grid-project-content">
                <div
                  className="project-category"
                  style={{ backgroundColor: project.categoryColor }}
                >
                  {project.category}
                </div>
                <h4 className="grid-project-title">{project.title}</h4>
                <p className="grid-project-description">
                  {project.description}
                </p>
                <div className="project-author">
                  <span className="author-name">{project.author}</span>
                </div>
                {/* UPDATED: Changed from button to Link */}
                <Link to={`/project/${project.id}`} className="learn-more-btn">
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/login" className="view-all-btn">
            View All Projects
          </Link>
        </div>
      </Element>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">π</div>
              <div>
                <h3>Archimedes Portal</h3>
                <span className="tagline">Research Hub</span>
              </div>
            </div>
            <p className="brand-description">
              Empowering researchers worldwide to collaborate, innovate, and
              advance human knowledge through cutting-edge research and
              technology.
            </p>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li>
                <a href="/join">Join Network</a>
              </li>
              <li>
                <a href="/newsletter">Newsletter</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <div className="contact-info">
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>contact@archimedes.edu</span>
              </div>
              <div className="contact-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>Oakland, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Archimedes Portal. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
