import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "./Navbar.css";

const Navbar = ({ userRole, onLogout }) => {
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const handleLogout = () => {
    // Directly call the onLogout function passed from the parent component
    onLogout();
    // Programmatically navigate to the homepage (or login page)
    navigate("/"); // Redirect to the homepage (or login page)
  };

  const renderNavLinks = () => {
    if (!userRole) {
      // No user logged in
      return (
        <div className="nav-links">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn register-btn">Register</Link>
        </div>
      );
    }

    // If user is logged in
    let links = [];

    if (userRole === "foodLover") {
      links = ["Home", "Favorites", "Profile", "Logout"];
    } else if (userRole === "chef") {
      links = ["Home", "MyRecipes", "Profile", "Logout"];
    } else if (userRole === "admin") {
      links = ["Home", "Chef", "Customer", "Recipes", "Logout"];
    }

    return (
      <div className="nav-links">
        {links.map((link) => (
          link === "Logout" ? (
            <button
              key={link}
              className="nav-btn"
              onClick={handleLogout}
            >
              {link}
            </button>
          ) : (
            <Link 
              key={link}
              to={`/${link.toLowerCase()}`} 
              className="nav-btn nav-link"
            >
              {link}
            </Link>
          )
        ))}

      </div>
    );
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        RecipeNest
      </Link>
      {renderNavLinks()}
    </nav>
  );
};

export default Navbar;
