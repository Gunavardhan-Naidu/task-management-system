"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "@/app/providers/Sessionprovider";
import { useRouter } from "next/navigation";
import axios from "@/app/utils/axios";

function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/account/profile");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      if (response.status === 200) {
        setSuccessMsg("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      setErrorMsg(error.response?.data?.error || "Failed to change password");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AccountStyled>
      <div className="min-h-screen flex items-center justify-center bg-[#181818] text-white">
        <div className="w-full max-w-md p-8 bg-[#212121] rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 text-center">Account Settings</h3>
          
          {/* Profile Section */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-[#27AE60] flex items-center justify-center text-3xl">
                {userProfile?.username?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-medium">{userProfile?.username || "User"}</h4>
              <p className="text-gray-400">{userProfile?.email}</p>
            </div>
          </div>

          {/* Change Password Section */}
          <form onSubmit={handlePasswordChange} className="mb-8">
            <h4 className="text-lg font-medium mb-4">Change Password</h4>
            {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md bg-[#131313] border border-[#2a2e35] text-white focus:outline-none focus:border-[#27AE60]"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md bg-[#131313] border border-[#2a2e35] text-white focus:outline-none focus:border-[#27AE60]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md bg-[#131313] border border-[#2a2e35] text-white focus:outline-none focus:border-[#27AE60]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#27AE60] hover:bg-[#1e8a4a] text-white font-medium rounded-md transition-colors duration-200"
            >
              Change Password
            </button>
          </form>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </AccountStyled>
  );
}

const AccountStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colorBg2};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default AccountPage; 