import React, { useState } from "react";
import "../styles/SignUp.css";
import auth_img from "../assets/auth_img.png";
import axios from "axios";

const SignUp = () => {
  const data = { email: "", username: "", mobile: "", password: "" };
  const [inputData, setInputData] = useState(data);

  const handleData = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${
            import.meta.env.VITE_BASE_URL
          }users/register`, inputData)
      .then((response) => {
        console.log("Response:", response);
      })
      .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error);
      });
  };

  return (
    <div className="sign-up">
      <div className="sign-up-banner">
      <div className="sign-up-headings">
        <p className="sign-up-headings-sub-heading1">Sign Up to</p>
        <p className="sign-up-headings-sub-heading2">Saloon Management App</p>
        <p className="sign-up-headings-sub-heading3">
          Your journey to effortless salon management begins here. <br />
          Join us and transform your business today!
        </p>
      </div>
      <div className="sign-up-img">
        <img src={auth_img} alt="" />
      </div>
      </div>
   
      <div className="sign-up-form">
        <div className="sign-up-form_heading">
          <p>
            Welcome to <span>Saloon</span>
          </p>
          <p>Sign Up</p>
        </div>
        <form className="sign-up__form">
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            id="email"
            name="email"
            value={inputData.email}
            onChange={handleData}
            placeholder="Enter your email address"
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputData.username}
            onChange={handleData}
            placeholder="Enter your username"
          />
          <label htmlFor="mobile">Contact Number</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={inputData.mobile}
            onChange={handleData}
            placeholder="Enter your contact number"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputData.password}
            onChange={handleData}
            placeholder="Enter your password"
          />
               <div className="sign-in__form__forgot-password">
            <a href="/login">Already have an account ?</a>
            
          </div>
          <button type="submit" onClick={handleSubmit}>
            Sign up
          </button>
        </form>
      </div>
     
    </div>
  );
};

export default SignUp;
