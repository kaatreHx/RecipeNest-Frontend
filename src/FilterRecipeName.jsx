import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./FilterRecipePage.css";
import Footer from './Footer';

const FilterRecipeName = () => {
  const { recipeName } = useParams();
  const [chefNames, setChefNames] = useState({});  // State to store chef names by chefId
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChefName = async (chefId) => {
      if (!chefNames[chefId]) { // Check if the chef's name is already fetched
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
            name: recipeName,
            category: ""
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
  }, [recipeName, chefNames]);

  return (
    <>
        <div className="filter-recipes-page">
        <h2 className="filter-section-title">Search Recipe: {decodeURIComponent(recipeName)}</h2>

        {loading ? (
            <p>Loading recipes...</p>
        ) : error ? (
            <p>{error}</p>
        ) : recipes.length > 0 ? (
            <div className="filter-recipes-container">
            {recipes.map((recipe, index) => (
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
                </div>
                </div>
            ))}
            </div>
        ) : (
            <p>No recipes found for this Name.</p>
        )}
        </div>
        <Footer />
    </>
  );
};

export default FilterRecipeName;
