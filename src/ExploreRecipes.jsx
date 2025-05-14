import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./FilterRecipePage.css";
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExploreRecipe = () => {
  const [chefNames, setChefNames] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 New for search

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    setUserId(storedUserId);
    setUserRole(storedUserRole);

    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://localhost:7242/api/RecipeNest/recipes', {
          headers: { 'Content-Type': 'application/json' },
        });

        const fetchedRecipes = response.data.map(recipe => ({
          ...recipe,
          liked: false,
        }));

        setRecipes(fetchedRecipes);

        const uniqueChefIds = [...new Set(response.data.map(recipe => recipe.chefId))];
        uniqueChefIds.forEach(async (chefId) => {
          try {
            const chefResponse = await axios.get(`https://localhost:7242/api/Chef/chef/${chefId}`);
            setChefNames(prev => ({ ...prev, [chefId]: chefResponse.data.name }));
          } catch (err) {
            console.error(`Error fetching chef with ID ${chefId}:`, err);
          }
        });

        if (storedUserId) {
          const updatedWithLikes = await Promise.all(fetchedRecipes.map(async (recipe) => {
            try {
              const likeResponse = await axios.get(`https://localhost:7242/api/RecipeNest/check-like/${storedUserId}/${recipe.id}`);
              return { ...recipe, liked: likeResponse.data };
            } catch (err) {
              console.error(`Error checking like for recipe ${recipe.id}:`, err);
              return recipe;
            }
          }));

          setRecipes(updatedWithLikes);
        }

      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleLike = async (recipeId) => {
    if (!userId) return;
    try {
      const updatedRecipes = recipes.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              liked: !recipe.liked,
              recipeLike: recipe.liked ? recipe.recipeLike - 1 : recipe.recipeLike + 1,
            }
          : recipe
      );
      setRecipes(updatedRecipes);
      await axios.post(`https://localhost:7242/api/RecipeNest/like/${recipeId}/${userId}`);
      toast.success('Liked');
    } catch (err) {
      console.error('Error liking/unliking recipe:', err);
      toast.error('Failed to process action.');
    }
  };

  const handleFavorite = async (recipeId) => {
    if (!userId) return;
    try {
      await axios.post(`https://localhost:7242/api/RecipeNest/favorites/${recipeId}/${userId}`);
      toast.success('Added to favorites!');
    } catch (err) {
      console.error('Error adding to favorites:', err);
      toast.error('Failed to add to favorites.');
    }
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await axios.delete(`https://localhost:7242/api/RecipeNest/recipes/${recipeId}`);
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      toast.success('Recipe deleted successfully!');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      toast.error('Failed to delete recipe.');
    }
  };

  // 👇 Filtered recipes based on search term
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="filter-recipes-page">
        <h2 className="filter-section-title">{userRole === 'admin' ? 'Recipes' : 'Explore Recipes'}</h2>

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
                  <p className="filter-recipe-chef"><strong>Chef:</strong> {chefNames[recipe.chefId] || 'Loading...'}</p>
                  <p className="filter-recipe-ingredients"><strong>Time:</strong> {recipe.time}</p>
                  <p className="filter-recipe-likes"><strong>Likes:</strong> {recipe.recipeLike}</p>
                  

                  <div className="recipe-buttons">
                    {userId && userRole === 'foodLover' && (
                      <>
                        <button onClick={() => handleLike(recipe.id)} className="like-button">
                          {recipe.liked ? 'Unlike' : 'Like'}
                        </button>
                        <button onClick={() => handleFavorite(recipe.id)} className="favorite-button">Add to Favorite</button>
                      </>
                    )}

                    {userRole === 'admin' && (
                      <button onClick={() => handleDelete(recipe.id)} className="delete-button">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recipes found.</p>
        )}
      </div>

      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default ExploreRecipe;
