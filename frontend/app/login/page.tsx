"use client";
import React , {useState}from "react";
import styled from "styled-components";
import axios from '@/app/utils/axios';
import { useAuth } from "@/app/providers/Sessionprovider";
import { useRouter } from "next/navigation";

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      login(token, user);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginStyled>
      <div className="min-h-screen flex items-center justify-center bg-[#181818] text-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-[#212121] rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-center">Sign In</h3>
          {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}
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
          <div className="mb-4">
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
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-[#27AE60] focus:ring-[#27AE60] border-[#2a2e35] rounded"
                id="customCheck1"
              />
              <label className="ml-2 block text-sm text-gray-300" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>
          <div className="mb-6">
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-[#27AE60] hover:bg-[#1e8a4a] text-white font-medium rounded-md transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="text-[#27AE60] hover:text-[#1e8a4a]">
              Register
            </a>
          </p>
        </form>
      </div>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colorBg2};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LoginPage;