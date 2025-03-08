"use client";
import React from "react";
import styled from "styled-components";

function page() {
  return (
    <LoginStyled>
    <div className="min-h-screen bg-[#181818] text-white" style={{ fontSize: '17px' }}>
    <form className="max-w-md mx-auto pt-20">
    <h3>Sign In</h3>
    <div className="mb-3">
      <label>Email address</label>
      <input
        type="email"
        className="form-control"
        placeholder="Enter email"
      />
    </div>
    <div className="mb-3">
      <label>Password</label>
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
      />
    </div>
    <div className="mb-3">
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id="customCheck1"
        />
        <label className="custom-control-label" htmlFor="customCheck1">
          Remember me
        </label>
      </div>
    </div>
    <div className="d-grid">
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </div>
    <p className="register text-right">
      <a href="/register">Register</a>
    </p>
  </form>
  </div>
  </LoginStyled>
  );
}
const LoginStyled = styled.form`
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
export default page;