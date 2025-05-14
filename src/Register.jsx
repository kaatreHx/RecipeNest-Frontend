import React, { useState } from "react";
import "./Register.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profilePic: null,
        role: "",
    });

    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profilePic") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const sendData = new FormData();
        sendData.append("id", 0);
        sendData.append("name", formData.name);
        sendData.append("email", formData.email);
        sendData.append("password", formData.password);
        sendData.append("profilePic", formData.profilePic);

        const url =
            formData.role === "customer"
                ? "https://localhost:7242/api/Customer/foodlover"
                : "https://localhost:7242/api/Chef/chef";

        axios
            .post(url, sendData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Data posted successfully:", response.data);
                setShowPopup(true); 
                resetForm();
            })
            .catch((error) => {
                console.error("Error posting data:", error.response?.data || error.message);
            });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            profilePic: null,
            role: "",
        });
        document.getElementById("profilePicInput").value = ""; 
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="register-box">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <input
                                id="profilePicInput"
                                type="file"
                                name="profilePic"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-box">
                            <select
                                name="role"
                                required
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="">Select Role</option>
                                <option value="chef">Chef</option>
                                <option value="customer">FoodLover</option>
                            </select>
                        </div>
                        <button type="submit" className="btn">
                            Register
                        </button>
                    </form>

                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <h3>Registration Successful!</h3>
                                <button onClick={() => setShowPopup(false)}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
