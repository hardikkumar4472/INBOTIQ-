🧩 Role-Based Authentication App (Full Stack)

A modern full-stack web application demonstrating role-based authentication with User and Admin dashboards using React, Node.js, Express, and MongoDB.
It includes secure login, signup, JWT-based authentication, CRUD operations, and role-specific features — all deployed and production-ready.

🌐 Live Demo
Frontend: https://inbotiq-assignment.onrender.com/
Backend API: https://inbotiq-backend-4twp.onrender.com/

✨ Features
✅ Authentication & Authorization
Role-based Signup & Login (User / Admin)
JSON Web Token (JWT) Authentication with Access & Refresh Tokens
Secure Password Hashing using bcrypt

✅ Role-Based Dashboard
Dynamic greeting: “Welcome, [Name] (User/Admin)”
Protected routes – accessible only when logged in
Admin can view and manage all items
User can only manage their own items

✅ CRUD Functionality

Create, Read, Update, and Delete items
Search, filter, and pagination support
Client-side form validation

✅ Additional Features

Logout with refresh token invalidation
Socket.io-based real-time notifications
Error handling & alerts for unauthorized access
Responsive UI with Tailwind CSS

🛠️ Tech Stack
Frontend
⚛️ React (Vite)
💅 Tailwind CSS
🌍 React Router DOM
📦 Axios
🧩 React Hook Form + Zod (validation)
🔔 Socket.io Client

Backend
🟢 Node.js with Express.js
🗄️ MongoDB Atlas (Mongoose ODM)
🔐 JWT for authentication
🧂 Bcrypt for password hashing
⚡ Socket.io for real-time updates
🧩 Dotenv for environment management

⚙️ Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/hardikkumar4472/INBOTIQ-.git
cd role-auth-app

2️⃣ Setup Backend
cd backend
npm install

Create a .env file in the backend folder:

PORT=8000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL
JWT_ACCESS_SECRET=supersecretaccess123
JWT_REFRESH_SECRET=supersecretrefresh123
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d


Run the backend:
npm run dev



3️⃣ Setup Frontend
cd frontend
npm install


Create a .env file in the frontend folder:

VITE_API_BASE_URL
VITE_SOCKET_URL


Run the frontend:

npm run dev

🧩 API Endpoints
🔐 Authentication Routes
Method	Endpoint	Description
POST	/auth/signup	Register new user (User/Admin)
POST	/auth/login	Login and receive tokens
POST	/auth/refresh	Generate new access token using refresh token
POST	/auth/logout	Logout and invalidate refresh token
GET	/auth/me	Fetch current user info (protected)
📦 Item Routes (Protected)
Method	Endpoint	Description
GET	/items	Fetch items (supports search, pagination)
POST	/items	Create a new item
PUT	/items/:id	Update item by ID
DELETE	/items/:id	Delete item by ID
GET	/items/:id	Get item details by ID
🧾 Example .env.example
Backend .env.example
PORT=8000
MONGO_URI
FRONTEND_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRES
REFRESH_TOKEN_EXPIRES

Frontend .env.example
VITE_API_BASE_URL
VITE_SOCKET_URL

🧠 Project Highlights
🔒 Secure Authentication (JWT + Refresh)
⚡ Real-time notifications (Socket.io)
🧹 Auto token refresh via Axios interceptors
🧩 Clean folder structure (MERN best practices)
🧑‍💻 Role-based route protection middleware
🎨 Elegant Tailwind-based UI
🧾 Reusable context & hooks for auth and data
📁 Folder Structure
role-auth-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── .env

🚀 Deployment
Frontend
Deployed on render
Steps:
npm run build

Upload the dist folder to Vercel or Netlify.
Backend
Deployed on Render
Steps:
Add environment variables in Render dashboard.
Connect your GitHub repo.
Deploy — backend auto-starts on push.

👨‍💻 Author
Hardik Kumar

✉️ hardikv715@gmail.com

💬 Feedback

If you found this helpful, ⭐ the repository and connect with me on LinkedIn!
Suggestions, improvements, or PRs are always welcome 🚀
