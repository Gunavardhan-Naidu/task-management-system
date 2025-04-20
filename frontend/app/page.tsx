"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/Sessionprovider";
import Tasks from "@/app/Components/Tasks/Tasks";
import { useGlobalState } from "./context/globalProvider";

export default function HomePage() {
  const { token } = useAuth();
  const { tasks } = useGlobalState();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirects to login if not logged in
    }
  }, [token, router]);

 // if (!token) return null; // Prevent flicker

  return (
    <main>
      <Tasks title="All Tasks" tasks={tasks} />
    </main>
  );
}
