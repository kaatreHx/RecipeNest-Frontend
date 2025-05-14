import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./MyRecipes.css";
import Footer from "./Footer";

const MyRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [chefId, setChefId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const storedChefId = localStorage.getItem("userId"); 
    if (storedChefId) {
      setChefId(storedChefId);
    }
  }, []);

  useEffect(() => {
    if (chefId) {
      fetchRecipes();
    }
  }, [chefId]);

  const fetchRecipes = () => {
    axios.get(`https://localhost:7242/api/RecipeNest/recipes/chef/${chefId}`)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  };

  const handleUpdate = (id) => {
    navigate(`/update-recipe/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      axios.delete(`https://localhost:7242/api/RecipeNest/recipes/${id}`)
        .then(() => {
          setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
          console.log(`Recipe with ID ${id} deleted successfully.`);
        })
        .catch((error) => {
          console.error("Error deleting recipe:", error);
        });
    }
  };

  const handleAddRecipe = () => {
    navigate("/add-recipe"); 
  };

  return (
    <>
      <div className="my-recipes-page">
        {/* Search Input */}
        <div className="search-recipes-container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-recipes-input"
          />
        </div>

        <div className="chef-recipes-container">
          {/* Add New Recipe Card */}
          <div className="recipe-card add-new-card" onClick={handleAddRecipe}>
            <div className="add-new-content">
              <span className="plus-icon">+</span>
              <p>Add New Recipe</p>
            </div>
          </div>

          {/* Existing Recipes */}
          {recipes
            .filter((recipe) =>
              recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((recipe) => (
            <div className="recipe-card" key={recipe.id}>
              <img
                src={`https://localhost:7242${recipe.profilePic}`}
                alt={recipe.name}
                className="recipe-image"
              />
              <div className="recipe-details">
                <h2 className="recipe-name">{recipe.name}</h2>
                <p><strong>Category:</strong> {recipe.category}</p>
                <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                <p><strong>Time:</strong> {recipe.time}</p>
                <p><strong>Likes:</strong> {recipe.recipeLike}</p>
              </div>
              <div className="recipe-actions">
                <button onClick={() => handleUpdate(recipe.id)} className="update-button">Update</button>
                <button onClick={() => handleDelete(recipe.id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );  
};

export default MyRecipes;
