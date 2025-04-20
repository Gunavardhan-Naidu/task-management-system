"use client";
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/Sessionprovider';

function RegisterPage () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
  
      try {
        const response = await axios.post('/auth/register', {
          email,
          password,
          name,
        });
  
        const { token, user } = response.data;
        login(token, user);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <RegisterStyled>
      <div className="min-h-screen flex items-center justify-center bg-[#181818] text-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-[#212121] rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-center">Sign Up</h3>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-[#131313] border border-[#2a2e35] text-white focus:outline-none focus:border-[#27AE60]"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md bg-[#131313] border border-[#2a2e35] text-white focus:outline-none focus:border-[#27AE60]"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-[#131313] border border-[#2a2e35] text-white focus:outline-none focus:border-[#27AE60]"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-[#27AE60] hover:bg-[#1e8a4a] text-white font-medium rounded-md transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-[#27AE60] hover:text-[#1e8a4a]">
              Sign In
            </a>
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
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default RegisterPage;