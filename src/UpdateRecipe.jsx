import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateRecipe.css";
import Footer from "./Footer";

const UpdateRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeCategory: "",
    recipeIngredients: "",
    recipeTime: "",
    recipeImage: null, // store file
  });

  useEffect(() => {
    axios.get(`https://localhost:7242/api/RecipeNest/recipes/${id}?Id=${id}`)
      .then((response) => {
        setRecipe(response.data);
        setFormData({
          recipeName: response.data.name,
          recipeCategory: response.data.category,
          recipeIngredients: response.data.ingredients,
          recipeTime: response.data.time,
          recipeImage: null, // don't preload file input
        });
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "recipeImage") {
      setFormData((prevState) => ({
        ...prevState,
        recipeImage: files[0], // store uploaded file
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("Id", id); // important for update
    formDataToSend.append("Name", formData.recipeName);
    formDataToSend.append("Category", formData.recipeCategory);
    formDataToSend.append("Ingredients", formData.recipeIngredients);
    formDataToSend.append("Time", formData.recipeTime);

    if (formData.recipeImage) {
      formDataToSend.append("ProfilePic", formData.recipeImage);
    }

    axios.put(`https://localhost:7242/api/RecipeNest/recipes/${id}`, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => {
      alert("Recipe updated successfully!");
      navigate("/myrecipes");
    })
    .catch((error) => {
      console.error("Error updating recipe:", error);
    });
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <>
      <div className="update-recipe-container">
        <div className="update-form-container">
          <h2>Update Recipe</h2>
          <form onSubmit={handleSubmit} className="update-form" encType="multipart/form-data">
            <input
              type="text"
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              placeholder="Recipe Name"
              required
            />
            <input
              type="text"
              name="recipeCategory"
              value={formData.recipeCategory}
              onChange={handleChange}
              placeholder="Category"
              required
            />
            <textarea
              name="recipeIngredients"
              value={formData.recipeIngredients}
              onChange={handleChange}
              placeholder="Ingredients"
              required
            />
            <input
              type="text"
              name="recipeTime"
              value={formData.recipeTime}
              onChange={handleChange}
              placeholder="Time"
              required
            />
            <input
              type="file"
              name="recipeImage"
              accept="image/*"
              onChange={handleChange}
            />
            <button type="submit">Update Recipe</button>
          </form>
        </div>

        <div className="recipe-image-container">
          <img
            src={`https://localhost:7242${recipe.profilePic}`}
            alt={recipe.name}
            className="update-recipe-image"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateRecipe;
