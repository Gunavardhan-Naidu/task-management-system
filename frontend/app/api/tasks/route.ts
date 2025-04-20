import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const API_BASE_URL = "http://localhost:8080"; // Your Go backend

const getUserFromToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; // Remove Bearer
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userID: string; username: string };
    return { token, userId: decoded.userID };
  } catch (err) {
    console.error(" Token verification failed:", err);
    return null;
  }
};

// -------------------------------------------
// POST: Create Task
// -------------------------------------------
export async function POST(req: Request) {
  try {
    const auth = getUserFromToken(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token, userId } = auth;

    const { title, description, date, completed, important } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (title.length < 3) {
      return NextResponse.json({ error: "Title too short" }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        date,
        is_completed: completed,
        is_important: important,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.error || "Failed to create task");
    }

    const task = await response.json();
    return NextResponse.json(task);

  } catch (error) {
    console.error("ERROR CREATING TASK:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error creating task" }, { status: 500 });
  }
}

// -------------------------------------------
// GET: Fetch Tasks
// -------------------------------------------
export async function GET(req: Request) {
  try {
    const auth = getUserFromToken(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token, userId } = auth;

    const response = await fetch(`${API_BASE_URL}/tasks?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) throw new Error("Failed to fetch tasks");

    const tasks = await response.json();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("ERROR GETTING TASKS:", error);
    return NextResponse.json({ error: "Error getting tasks", status: 500 });
  }
}

// -------------------------------------------
// PUT: Update Task
// -------------------------------------------
export async function PUT(req: Request) {
  try {
    const auth = getUserFromToken(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token, userId } = auth;
    const { id, is_completed, is_important } = await req.json();

    // Get the task ID from the URL
    const url = new URL(req.url);
    const taskId = url.pathname.split('/').pop();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ is_completed, is_important }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.error || "Failed to update task");
    }

    const task = await response.json();
    return NextResponse.json(task);
  } catch (error) {
    console.error("ERROR UPDATING TASK:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error updating task" }, { status: 500 });
  }
}

// -------------------------------------------
// DELETE: Delete Task
// -------------------------------------------
export async function DELETE(req: Request) {
  try {
    const auth = getUserFromToken(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = auth;

    // Get the task ID from the URL
    const url = new URL(req.url);
    const taskId = url.pathname.split('/').pop();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.error || "Failed to delete task");
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("ERROR DELETING TASK:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error deleting task" }, { status: 500 });
  }
}
