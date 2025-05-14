import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./FilterRecipePage.css";
import Footer from './Footer';

const FavoritePage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [chefNames, setChefNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous error
  
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }
  
      const response = await axios.get(`https://localhost:7242/api/RecipeNest/favorites/${userId}`);
      setFavoriteRecipes(response.data);
  
      const uniqueChefIds = [...new Set(response.data.map(fav => fav.chefId))];
      uniqueChefIds.forEach(async (chefId) => {
        try {
          const chefResponse = await axios.get(`https://localhost:7242/api/Chef/chef/${chefId}`);
          setChefNames(prev => ({ ...prev, [chefId]: chefResponse.data.name }));
        } catch (err) {
          console.error(`Error fetching chef with ID ${chefId}:`, err);
        }
      });
  
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
  
      if (error.response && error.response.status === 404) {
        // No favorites found => not a real error
        setFavoriteRecipes([]);
      } else {
        // Some real server error happened
        setError('Failed to fetch favorite recipes.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`https://localhost:7242/api/RecipeNest/favorites/${favoriteId}`);
      alert('Recipe removed from favorites!');
      // Instead of manually filtering, re-fetch updated list
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite.');
    }
  };

  return (
    <>
      <div className="filter-recipes-page">
        <h2 className="filter-section-title">Your Favorite Recipes</h2>

        {loading ? (
          <p>Loading favorites...</p>
        ) : error ? (
          <p>{error}</p>
        ) : favoriteRecipes.length > 0 ? (
          <div className="filter-recipes-container">
            {favoriteRecipes.map((favorite, index) => (
              <div key={index} className="filter-recipe-card">
                <img
                  src={`https://localhost:7242${favorite.profilePic}`}
                  alt={favorite.name}
                  className="filter-recipe-img"
                />
                <div className="filter-recipe-details">
                  <h3 className="filter-recipe-title">{favorite.name}</h3>
                  <p className="filter-recipe-ingredients"><strong>Ingredients:</strong> {favorite.ingredients}</p>
                  <p className="filter-recipe-chef"><strong>Chef:</strong> {chefNames[favorite.chefId] || 'Loading...'}</p>
                  <p className="filter-recipe-likes"><strong>Likes:</strong> {favorite.recipeLike}</p>

                  <div className="favorite-buttons">
                    <button onClick={() => handleRemoveFavorite(favorite.favoriteId)} className="remove-favorite-btn">
                      Remove Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorite recipes found.</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default FavoritePage;
