import React, { useState } from "react";
import Navbar from "./Navbar";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css";
import Footer from "./Footer";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const [loading, setLoading] = useState(false); // Loading state for button

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { email, password } = formData;

    // Admin login
    if (email === "recipe@gmail.com" && password === "recipe@123") {
      alert("Login successful as Admin!");
      localStorage.setItem("userId", "admin123");
      localStorage.setItem("userRole", "admin");
      onLoginSuccess("admin");
      setLoading(false);
      navigate("/");
      return;
    }

    // FoodLover login
    try {
      const foodLoverResponse = await axios.post(
        `https://localhost:7242/api/Customer/foodLoverLogin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      if (foodLoverResponse.data) {
        const { userId } = foodLoverResponse.data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", "foodLover");
        onLoginSuccess("foodLover");
        alert("Login successful as FoodLover!");
        setLoading(false);
        navigate("/");
        return;
      }
    } catch (foodLoverError) {
      console.error("FoodLover login failed:", foodLoverError.response?.data || foodLoverError.message);
    }

    // Chef login
    try {
      const chefResponse = await axios.post(
        `https://localhost:7242/api/Chef/chefLogin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      if (chefResponse.data) {
        const { userId } = chefResponse.data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", "chef");
        onLoginSuccess("chef"); 
        alert("Login successful as Chef!");
        setLoading(false);
        navigate("/");
        return;
      }
    } catch (chefError) {
      console.error("Chef login failed:", chefError.response?.data || chefError.message);
    }

    setLoading(false);
    setErrorMessage("Invalid email or password. Please try again.");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
