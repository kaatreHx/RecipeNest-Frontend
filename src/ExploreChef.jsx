import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';
import "./LandingPage.css";
import { toast } from "react-toastify";

const ExploreChef = () => {
  const [chefs, setChefs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 New state for search
  const [userRole, setUserRole] = useState("");

  const fetchChefs = async () => {
    try {
      const response = await axios.get('https://localhost:7242/api/Chef/chefs');
      setChefs(response.data);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    }
  };

  const handleDelete = async (chefId) => {
    try {
      await axios.delete(`https://localhost:7242/api/Chef/chef/${chefId}`);
      await axios.delete(`https://localhost:7242/api/RecipeNest/recipes/chef/${chefId}`);

      toast.success("Chef deleted successfully!");

      setChefs(prevChefs => prevChefs.filter(chef => chef.id !== chefId));
    } catch (error) {
      toast.error("Failed to delete chef.");
      console.error('Error deleting chef or recipes:', error);
    }
  };

  useEffect(() => {
    fetchChefs();
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // 👇 Filter chefs based on search term
  const filteredChefs = chefs.filter((chef) =>
    chef.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h2 className="section-title-exploreChef">Chefs</h2>

      {/* 👇 Search Field */}
      <div className="search-chef-container">
        <input
          type="text"
          placeholder="Search chefs by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-chef-input"
        />
      </div>

      <div className="chefs">
        {filteredChefs.length > 0 ? (
          filteredChefs.map((chef, index) => (
            <div key={index} className="chef-card">
              <div className="chef-image-card">
                <img 
                  src={`https://localhost:7242${chef.profilePic}`} 
                  alt={chef.name} 
                  className="chef-img-square" 
                />
              </div>
              <div className="chef-info">
                <p className="chef-name">{chef.name}</p>
                <p className="chef-email">{chef.email}</p>

                {userRole === "admin" && (
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(chef.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No chefs found.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ExploreChef;
