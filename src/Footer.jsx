import React from 'react'
import { FaEnvelope, FaLock, FaFacebook, FaInstagram, FaGoogle, FaYoutube, FaPhone } from "react-icons/fa";
import "./Footer.css"

const Footer = () => {
  return (
    <footer>
          <h3>Recipe Nest</h3>
          <p>It is a website where you can save and share your favorite recipes.</p>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaGoogle />
            <FaYoutube />
          </div>
          <p>
            <FaEnvelope /> recipenest@food.np | <FaPhone /> 05-865-441
          </p>
          <p>&copy; 2025 RecipeNest</p>
    </footer>
  )
}

export default Footer
