import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const API_BASE_URL = "http://localhost:8080";

const getUserFromToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userID: string; username: string };
    return { token, userId: decoded.userID };
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

// PUT: Update Task
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const auth = getUserFromToken(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = auth;
    const body = await req.json();
    const { id: taskId } = await context.params;

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Check if this is a full update (contains title, description, date)
    if (body.title && body.description && body.date) {
      if (body.title.length < 3) {
        return NextResponse.json({ error: "Title too short" }, { status: 400 });
      }
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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

// DELETE: Delete Task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getUserFromToken(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = auth;
    const taskId = await Promise.resolve(params.id);

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