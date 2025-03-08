import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { motion } from "framer-motion";

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <motion.h1
        className="coming-soon-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        Archimedes Club
      </motion.h1>
      <motion.p
        className="coming-soon-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Something amazing is coming soon. Stay tuned!
      </motion.p>
      <motion.button
        className="login-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/login")}
      >
        Login
      </motion.button>
    </div>
  );
};

export default ComingSoon;
