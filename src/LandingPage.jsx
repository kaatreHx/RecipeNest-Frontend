import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios for API calls
import { Link, useNavigate } from 'react-router-dom';  // For navigation
import Footer from './Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();  // inside your component
  const [categories, setCategories] = useState([]);  // State to store categories
  const [chefs, setChefs] = useState([]);  // State to store chefs
  const [trendingRecipes, setTrendingRecipes] = useState([]);  // State to store trending recipes
  const [chefNames, setChefNames] = useState({});  // State to store chef names by chefId
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/recipeName/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleExplore = () => {
    navigate(`/explore`); 
  };

  useEffect(() => {

    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7242/api/RecipeNest/recipes/types');  // Replace with your API URL
        setCategories(response.data);  // Assuming the response contains the categories array
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetch chefs from the API
    const fetchChefs = async () => {
      try {
        const response = await axios.get('https://localhost:7242/api/Chef/chefs');  // Replace with your API URL
        setChefs(response.data);  // Assuming the response contains the chefs array with { name, imageBase64 }
      } catch (error) {
        console.error('Error fetching chefs:', error);
      }
    };

    // Fetch trending recipes from the API
    const fetchTrendingRecipes = async () => {
      try {
        const response = await axios.get('https://localhost:7242/api/RecipeNest/recipes/trending');  // Replace with your API URL
        setTrendingRecipes(response.data);  // Assuming the response contains the trending recipes array
        // Fetch chef names for each recipe
        response.data.forEach((recipe) => {
          if (!chefNames[recipe.chefId]) {
            fetchChefName(recipe.chefId);
          }
        });
      } catch (error) {
        console.error('Error fetching trending recipes:', error);
      }
    };

    // Fetch chef name by chefId
    const fetchChefName = async (chefId) => {
      try {
        const response = await axios.get(`https://localhost:7242/api/Chef/chef/${chefId}`);  // API to fetch chef data by ID
        setChefNames(prevState => ({ ...prevState, [chefId]: response.data.name }));
      } catch (error) {
        console.error('Error fetching chef name:', error);
      }
    };

    fetchCategories();
    fetchChefs();
    fetchTrendingRecipes();
  }, [chefNames]);  // Run effect only when chefNames state changes

  return (
    <>
      <div className="dashboard-container">
        <div className="hero-section">
          <img src="./src/Image/HomePic.jpg" alt="Hero Banner" className="hero-img" />
          <div className="hero-overlay">
            <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search Recipe" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button onClick={handleSearch}>Search</button>

            </div>
            <button className="explore-btn" onClick={handleExplore}>Explore Recipes</button>
          </div>
        </div>

        <h2 className="section-title">Categories</h2>
        <div className="categories">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/categories/${encodeURIComponent(category)}`} 
                className="card"
              >
                <p>{category}</p>
              </Link>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>


        <h2 className="section-title">Chefs</h2>
        <div className="chefs">
          {chefs.length > 0 ? (
            chefs.map((chef, index) => (
              <div key={index} className="chef-card">
                {/* Square Card for Chefs */}
                <div className="chef-image-card">
                  <img 
                    src={`https://localhost:7242${chef.profilePic}`} 
                    alt={chef.name} 
                    className="chef-img-square" 
                  />
                </div>
                <p className="chef-name">{chef.name}</p>
              </div>
            ))
          ) : (
            <p>Loading chefs...</p>
          )}
        </div>

        {/* See All Button for Chefs */}
        <div className="see-all">
          <Link to="/chefs" className="see-all-link">See All Chefs</Link>
        </div>

        <h2 className="section-title">Trending Recipes</h2>
        <div className="trending-recipes">
          {trendingRecipes.length > 0 ? (
            trendingRecipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
                {/* Square Card for Recipes */}
                <div className="recipe-image-card">
                  <img 
                    src={`https://localhost:7242${recipe.profilePic}`} 
                    alt={recipe.name} 
                    className="recipe-img-square" 
                  />
                </div>
                <div className="recipe-details">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="recipe-ingredients"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                  <p className="recipe-time"><strong>Time Taken:</strong> {recipe.time} minutes</p>
                  <p className="recipe-chef-id">
                    <strong>Chef:</strong> {chefNames[recipe.chefId] || 'Loading chef name...'}
                  </p>
                  <p className="recipe-likes"><strong>Likes:</strong> {recipe.recipeLike}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading trending recipes...</p>
          )}
        </div>

        {/* See All Button for Trending Recipes */}
        <div className="see-all">
          <Link to="/explore" className="see-all-link">See All Recipes</Link>
        </div>

        {/* About Us Section */}
        <div className="about-us-section">
          <h2 className="section-title">About Us</h2>
          <p className="about-us-description">
            Welcome to RecipeNest! We are a community of passionate food lovers and chefs. Our mission is to bring
            together diverse recipes and culinary experiences to inspire and connect people through food. Whether you
            are a home cook or a professional chef, our platform offers something for everyone. Join us on this
            delicious journey!
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LandingPage;
