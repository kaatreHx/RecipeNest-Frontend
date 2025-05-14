import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRecipe.css"; // optional for styling
import Footer from "./Footer";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const chefId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chefId) {
      alert("Chef ID not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Category", category);
    formData.append("Ingredients", ingredients);
    formData.append("Time", time);
    formData.append("RecipeLike", 0); // Set likes to 0 by default
    formData.append("ChefId", chefId);
    if (profilePic) {
      formData.append("ProfilePic", profilePic);
    }

    try {
      await axios.post("https://localhost:7242/api/RecipeNest/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Recipe added successfully!");
      navigate("/myrecipes");
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    }
  };

  return (
    <>
    <div className="add-recipe-page">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <textarea
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Time (e.g., 30 mins)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

        <button type="submit" className="submit-button">Add Recipe</button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default AddRecipe;
