"use client";
import React from "react";
import { useState } from "react";
import styled from "styled-components";

function RegisterPage () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const response = await fetch("http://localhost:8080/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to register");
        }
  
        setSuccess("User registered successfully!");
        setError("");
        setName("");
        setEmail("");
        setPassword("");
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setSuccess("");
      }
    };

  return (
    <RegisterStyled>
      <div className="min-h-screen bg-[#181818] text-white" style={{ fontSize: '17px' }}>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-20">
            <h3>Sign Up</h3>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          
            <div className="mb-3">
              <label>Username</label>
              <input type="text" className="form-control" placeholder="Username" />
            </div>
            <div className="mb-3">
              <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
            </div>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
            <p className="forgot-password text-right">
              Already registered <a href="/sign-in">sign in?</a>
            </p>
        </form>
      </div>
    </RegisterStyled>
  );
}
const RegisterStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colorBg2};
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colorGrey3};

  form {
    background-color: ${(props) => props.theme.colorBg3};
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid ${(props) => props.theme.borderColor2};
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
    color: ${(props) => props.theme.colorGrey0};
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 1.6rem 0;
    font-weight: 500;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      margin-bottom: 0.5rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);
      color: ${(props) => props.theme.colorGrey0};

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }
    input {
      width: 100%;
      padding: 1rem;
      background-color: ${(props) => props.theme.colorGreyDark};
      color: ${(props) => props.theme.colorGrey2};
      border-radius: 0.5rem;
      border: 1px solid ${(props) => props.theme.borderColor2};

      &:focus {
        outline: none;
        border-color: ${(props) => props.theme.colorGreenDark};
      }
    }
  }

  .submit-btn button {
    width: 100%;
    padding: 0.8rem 2rem;
    border-radius: 0.8rem;
    background-color: ${(props) => props.theme.colorPrimaryGreen};
    color: ${(props) => props.theme.colorWhite};
    font-weight: 500;
    font-size: 1.2rem;
    transition: all 0.35s ease-in-out;

    &:hover {
      background: ${(props) => props.theme.colorGreenDark} !important;
    }

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;
    }
  }

  .register {
    text-align: right;
    margin-top: 1rem;
    a {
      color: ${(props) => props.theme.colorGreenDark};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
export default RegisterPage;