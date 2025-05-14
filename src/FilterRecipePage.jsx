import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./FilterRecipePage.css";
import Footer from './Footer';

const FilterRecipePage = () => {
  const { categoryName } = useParams();
  const [chefNames, setChefNames] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(""); // 👈 Added for role checking
  const [searchTerm, setSearchTerm] = useState(""); // 👈 New for search

  useEffect(() => {
    const fetchChefName = async (chefId) => {
      if (!chefNames[chefId]) {
        try {
          const response = await axios.get(`https://localhost:7242/api/Chef/chef/${chefId}`);
          setChefNames((prevState) => ({ ...prevState, [chefId]: response.data.name }));
        } catch (error) {
          console.error('Error fetching chef name:', error);
        }
      }
    };

    const fetchRecipesByCategory = async () => {
      try {
        const response = await axios.post(
          'https://localhost:7242/api/RecipeNest/recipes/filter',
          {
            name: "",
            category: categoryName
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        setRecipes(response.data);

        response.data.forEach((recipe) => {
          fetchChefName(recipe.chefId);
        });
        
      } catch (error) {
        console.error('Error fetching recipes by category:', error);
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesByCategory();

    // 👇 Fetch role from localStorage when page loads
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
  }, [categoryName, chefNames]);

  const handleDelete = async (chefId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chef and their recipes?");
    if (!confirmDelete) return;

    try {
      // Delete chef first
      await axios.delete(`https://localhost:7242/api/Chef/chef/${chefId}`);
      // Then delete all recipes of the chef
      await axios.delete(`https://localhost:7242/api/RecipeNest/recipes/chef/${chefId}`);
      
      // Remove deleted chef's recipes from local state
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.chefId !== chefId));
    } catch (error) {
      console.error('Error deleting chef or recipes:', error);
    }
  };

  // 👇 Filtered recipes based on search term
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="filter-recipes-page">
        <h2 className="filter-section-title">Recipes in {decodeURIComponent(categoryName)}</h2>

        {/* 👇 Search Field */}
        <div className="search-recipe-container">
          <input
            type="text"
            placeholder="Search recipes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-recipe-input"
          />
        </div>

        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredRecipes.length > 0 ? (
          <div className="filter-recipes-container">
            {filteredRecipes.map((recipe, index) => (
              <div key={index} className="filter-recipe-card">
                <img
                  src={`https://localhost:7242${recipe.profilePic}`}
                  alt={recipe.name}
                  className="filter-recipe-img"
                />

                <div className="filter-recipe-details">
                  <h3 className="filter-recipe-title">{recipe.name}</h3>
                  <p className="filter-recipe-ingredients"><strong>Ingredients:</strong> {recipe.ingredients}</p>
                  <p className="filter-recipe-chef"><strong>Chef:</strong> {chefNames[recipe.chefId] || 'Loading chef name...'}</p>
                  <p className="filter-recipe-ingredients"><strong>Time:</strong> {recipe.time}</p>
                  <p className="filter-recipe-likes"><strong>Likes:</strong> {recipe.recipeLike}</p>

                  {/* 👇 Show Delete button ONLY for Admins */}
                  {userRole === "admin" && (
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(recipe.chefId)}
                    >
                      Delete Chef
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recipes found for this category.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FilterRecipePage;
