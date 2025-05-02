// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { Link } from "react-router-dom";
// import { Link as ScrollLink, Element } from "react-scroll";

// import "../styles/LandingPage.css"; // Make sure this path matches your file structure

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { userData } = useAuth();

//   useEffect(() => {
//     if (userData) {
//       navigate("/dashboard");
//     }
//   }, [userData, navigate]);

//   return (
//     <div className="landing-container">
//       {/* Header */}
//       <header className="header">
//         <div className="logo">Archimedes Portal</div>
//         <nav className="nav">
//           <ScrollLink
//             to="about"
//             smooth={true}
//             duration={500}
//             offset={-70}
//             className="nav-link"
//           >
//             About Us
//           </ScrollLink>

//           <Link to="/login" className="login-btn">
//             Login
//           </Link>
//         </nav>
//       </header>

//       {/* Banner */}
//       <section className="banner">
//         <h1 className="title">Innovate with Archimedes</h1>
//         <p className="subtitle">
//           Explore projects, connect with creators, and solve global challenges.
//         </p>
//         <Link to="/login" className="login-btn">
//           Explore Projects
//         </Link>
//       </section>

//       {/* About Us */}
//       <Element name="about" className="about">
//         <h2>About Us</h2>
//         <p>
//           We bridge innovation and education by connecting students and faculty
//           through collaborative research and real-world problem-solving.
//         </p>

//         <section className="cards-container">
//           <div className="card" id="mission">
//             <h3>Our Mission</h3>
//             <p>
//               Empowering knowledge sharing and collaborative learning through
//               digital solutions.
//             </p>
//           </div>
//           <div className="card" id="vision">
//             <h3>Our Vision</h3>
//             <p>
//               To be a global platform enabling interdisciplinary innovation
//               across communities.
//             </p>
//           </div>
//         </section>
//       </Element>

//       {/* Footer */}
//       <footer className="footer">
//         <p>© 2025 Archimedes Portal. All rights reserved.</p>
//         {/* <div className="social">
//           <a href="#">LinkedIn</a>
//           <a href="#">Twitter</a>
//           <a href="#">GitHub</a>
//         </div> */}
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

  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="logo">Archimedes Portal</div>
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
          <Link
            to="/login"
            className="login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Banner */}
      <section className="banner">
        <h1 className="title">Innovate with Archimedes</h1>
        <p className="subtitle">
          Explore projects, connect with creators, and solve global challenges.
        </p>
        <Link to="/login" className="login-btn">
          Explore Projects
        </Link>
      </section>

      {/* About Us */}
      <Element name="about" className="about">
        <h2>About Us</h2>
        <p>
          We bridge innovation and education by connecting students and faculty
          through collaborative research and real-world problem-solving.
        </p>
      </Element>

      {/* Mission & Vision */}
      <section className="cards-container">
        <div className="card" id="mission">
          <h3>Our Mission</h3>
          <p>
            Empowering knowledge sharing and collaborative learning through
            digital solutions.
          </p>
        </div>
        <div className="card" id="vision">
          <h3>Our Vision</h3>
          <p>
            To be a global platform enabling interdisciplinary innovation across
            communities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Archimedes Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
