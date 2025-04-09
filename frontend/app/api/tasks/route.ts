// import { NextResponse } from "next/server";
// import jwt from 'jsonwebtoken';

// const API_BASE_URL = "http://localhost:8080"; // Replace with your Golang backend URL

// export async function POST(req: Request) {
//   try {
//    // const { userId } = auth();
   
//     const token = req.headers.get('Authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
    
//     const decodedHeader = jwt.decode(token, { complete: true });
//     console.log("recieved token :", token);

//     console.log("JWT_SECRET:", process.env.JWT_SECRET);



//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//     const userId = decoded.userId;

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { title, description, date, completed, important } = await req.json();

//     if (!title || !description || !date) {
//       return NextResponse.json({
//         error: "Missing required fields",
//         status: 400,
//       });
//     }

//     if (title.length < 3) {
//       return NextResponse.json({
//         error: "Title must be at least 3 characters long",
//         status: 400,
//       });
//     }

//     // Call Golang backend to create task
//     const response = await fetch(`${API_BASE_URL}/tasks`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userId}`, // Send JWT for authentication
//       },
//       body: JSON.stringify({
//         title,
//         description,
//         date,
//         isCompleted: completed,
//         isImportant: important,
//         userId,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create task");
//     }

//     const task = await response.json();
//     return NextResponse.json(task);
//   } catch (error) {
//     console.log("ERROR CREATING TASK: ", error);
//     return NextResponse.json({ error: "Error creating task", status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const token = req.headers.get('Authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//     const userId = decoded.userId;

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized", status: 401 });
//     }

//     // Call Golang backend to fetch tasks
//     const response = await fetch(`${API_BASE_URL}/tasks?userId=${userId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${userId}`, // Send JWT for authentication
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch tasks");
//     }

//     const tasks = await response.json();
//     return NextResponse.json(tasks);
//   } catch (error) {
//     console.log("ERROR GETTING TASKS: ", error);
//     return NextResponse.json({ error: "Error getting tasks", status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   try {
   
//     const token = req.headers.get('Authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//     const userId = decoded.userId;

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const { isCompleted, id } = await req.json();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized", status: 401 });
//     }

//     // Call Golang backend to update task
//     const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userId}`, // Send JWT for authentication
//       },
//       body: JSON.stringify({ isCompleted }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update task");
//     }

//     const task = await response.json();
//     return NextResponse.json(task);
//   } catch (error) {
//     console.log("ERROR UPDATING TASK: ", error);
//     return NextResponse.json({ error: "Error updating task", status: 500 });
//   }
// }
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
        Authorization: `Bearer ${token}`, //  Send real JWT, not userId
      },
      body: JSON.stringify({
        title,
        description,
        date,
        isCompleted: completed,
        isImportant: important,
        userId,
      }),
    });

    if (!response.ok) throw new Error("Failed to create task");

    const task = await response.json();
    return NextResponse.json(task);

  } catch (error) {
    console.error("ERROR CREATING TASK:", error);
    return NextResponse.json({ error: "Error creating task", status: 500 });
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
        Authorization: `Bearer ${token}`, // Send JWT token
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
    const { isCompleted, id } = await req.json();

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //  Send JWT token
      },
      body: JSON.stringify({ isCompleted }),
    });

    if (!response.ok) throw new Error("Failed to update task");

    const task = await response.json();
    return NextResponse.json(task);
  } catch (error) {
    console.error("ERROR UPDATING TASK:", error);
    return NextResponse.json({ error: "Error updating task", status: 500 });
  }
}
