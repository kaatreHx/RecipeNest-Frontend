import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router
import Navbar from "./Navbar";
import Login from "./Login";
import Register from "./Register";
import LandingPage from "./LandingPage"; 
import FilterRecipePage from "./FilterRecipePage"
import FilterRecipeName from "./FilterRecipeName";
import ExploreRecipe from "./ExploreRecipes";
import ExploreChef from "./ExploreChef";
import ProfileEdit from "./ProfileEdit";
import PasswordChange from "./PasswordChange";
import FavoritePage from "./FavoritePage";
import Customer from "./Customer";
import MyRecipes from "./MyRecipes";
import UpdateRecipe from "./UpdateRecipe";
import AddRecipe from "./AddRecipe";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    // Remove userRole from localStorage and update the state
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setUserRole(""); // Update the state to reflect the logout
  };

  return (
    <Router> {/* Wrap your app with Router */}
      <div>
        <Navbar userRole={userRole} onLogout={handleLogout} />
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={setUserRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories/:categoryName" element={<FilterRecipePage />} />        
          <Route path="/recipeName/:recipeName" element={<FilterRecipeName />} />        
          <Route path="/explore" element={<ExploreRecipe />} />        
          <Route path="/recipes" element={<ExploreRecipe />} />        
          <Route path="/myrecipes" element={<MyRecipes />} />        
          <Route path="/update-recipe/:id" element={<UpdateRecipe />} />        
          <Route path="/add-recipe" element={<AddRecipe />} />        
          <Route path="/chefs" element={<ExploreChef />} />        
          <Route path="/chef" element={<ExploreChef />} />        
          <Route path="/customer" element={<Customer />} />        
          <Route path="/profile" element={<ProfileEdit />} />        
          <Route path="/password-change" element={<PasswordChange />} />   
          <Route path="/favorites" element={<FavoritePage />} />     
        </Routes>
      </div>
    </Router>
  );
};

export default App;
