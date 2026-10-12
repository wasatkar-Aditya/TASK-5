# 🚀 TaskFlow Pro - Fullstack Task Manager Web Application
> **Internship Task 5:** API Integration & Front-End Interaction  
> **Tech Stack:** React (Vite) + Node.js + Express.js + MongoDB (Mongoose)

## 🌐 GitHub Pages

The React interface is automatically deployed on every push to `main`:

- **Live site:** https://wasatkar-Aditya.github.io/TASK-5/
- **Deployment workflow:** [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)

GitHub Pages hosts static files only. To keep the live site fully usable, it automatically saves tasks in the visitor's browser when no `VITE_API_URL` is configured. Tasks persist after refresh on that browser, but are not shared between devices. To use the Express API and MongoDB database instead, deploy them separately (for example, an API host plus MongoDB Atlas), then provide the public API URL as `VITE_API_URL` during the frontend build.

---

## 📌 Architecture Overview & Data Flow

```
[ React + Vite UI ]  (Port 5173)
        │
        ▼  HTTP / Axios (JSON)
[ Express API Server ] (Port 5000)
        │
        ▼  Mongoose Schema Validation
[ MongoDB Database ] (Port 27017 or Atlas Cloud)
        │
        ▼
   Disk Storage:  Task5/data/db/  (Collection: `tasks`)
```

---

## 🗄️ Where Is The Data Stored?

Your data is **not stored in temporary browser memory or localStorage**. It is persistently saved in **MongoDB**:

1. **Database Name:** `taskmanager`
2. **Collection Name:** `tasks`
3. **Physical Storage on Disk (Local Mode):**
   - The database files (WiredTiger tables and transaction logs) are stored directly inside:
     `c:\Users\a\OneDrive\Documents\Task5\data\db\`
4. **Cloud Storage (Atlas Mode):**
   - If you set `MONGO_URI` to a MongoDB Atlas connection string in `backend/.env`, data is stored securely in MongoDB's cloud cluster.

---

## 📁 Project Structure

```
Task5/
├── backend/                     # Node.js & Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # Mongoose connection & error logging
│   │   ├── controllers/
│   │   │   └── taskController.js# CRUD controller logic
│   │   ├── middleware/
│   │   │   └── errorHandler.js  # Global error handling middleware
│   │   ├── models/
│   │   │   └── Task.js          # Mongoose Schema & validation rules
│   │   ├── routes/
│   │   │   └── taskRoutes.js    # Express RESTful endpoints
│   │   └── server.js            # Express application entry point
│   ├── .env                     # Backend environment variables
│   ├── .env.example             # Template for environment variables
│   ├── package.json             # Backend dependencies & scripts
│   ├── seed.mjs                 # Starter data population script
│   └── testApi.mjs              # Automated endpoint test script
│
├── frontend/                    # React + Vite Client
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js       # Axios client using VITE_API_URL
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header with live API status badge
│   │   │   ├── TaskStats.jsx    # Metric counter cards & progress bar
│   │   │   ├── TaskFilters.jsx  # Search, status pills, priority & sort
│   │   │   ├── TaskCard.jsx     # Task card with badges, timestamps & actions
│   │   │   ├── TaskList.jsx     # Responsive grid, skeletons & empty state
│   │   │   ├── TaskFormModal.jsx# Create/Edit task modal with validation
│   │   │   ├── ConfirmModal.jsx # Delete confirmation dialog
│   │   │   └── Toast.jsx        # Floating success/error notification
│   │   ├── App.jsx              # Main React state container & handlers
│   │   ├── index.css            # Custom modern CSS design system
│   │   └── main.jsx             # React DOM entry point
│   ├── .env                     # Frontend environment variables
│   ├── .env.example
│   ├── index.html
│   └── package.json
│
├── data/
│   └── db/                      # Local MongoDB database store
├── .gitignore                   # Git ignore file
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 How to Run on Windows (Step-by-Step)

### Option A: Both servers are ALREADY RUNNING right now!
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API URL:** [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)

### Option B: Running manually in two terminals:

#### Terminal 1: Start MongoDB & Backend Server
```powershell
# 1. Start MongoDB (if not running as a Windows service):
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "c:\Users\a\OneDrive\Documents\Task5\data\db" --port 27017

# 2. In backend directory:
cd c:\Users\a\OneDrive\Documents\Task5\backend
npm install
npm run dev
# (or: node src/server.js)
```

#### Terminal 2: Start React Frontend
```powershell
cd c:\Users\a\OneDrive\Documents\Task5\frontend
npm install
npm run dev
```
Open your browser at **`http://localhost:5173`**.

---

## 📮 Testing Every API Endpoint in Postman

### 1. Health Check
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/health`
- **Response:** `200 OK`
```json
{
  "success": true,
  "status": "Healthy",
  "timestamp": "2026-10-10T18:41:30.000Z"
}
```

### 2. Get All Tasks
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/tasks`
- **Query Params (Optional):** `?status=In Progress&priority=High&search=React`
- **Response:** `200 OK`

### 3. Get Single Task By ID
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/tasks/:id`
- **Response:** `200 OK` (or `404 Not Found` if nonexistent, `400 Bad Request` if invalid ObjectId)

### 4. Create Task
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/tasks`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Build Postman Documentation",
  "description": "Document all CRUD routes with response bodies",
  "status": "Pending",
  "priority": "High"
}
```
- **Response:** `201 Created`

### 5. Update Task
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/tasks/:id`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "status": "Completed"
}
```
- **Response:** `200 OK`

### 6. Delete Task
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/tasks/:id`
- **Response:** `200 OK`

---

## ☁️ How to Switch to MongoDB Atlas (Cloud)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** -> create a database user and password.
3. Go to **Network Access** -> click **Add IP Address** -> allow `0.0.0.0/0` (allow from anywhere).
4. Click **Connect** -> Choose **Drivers (Node.js)** -> Copy the connection string.
5. In `backend/.env`, change `MONGO_URI`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```
6. Restart the backend server. The app will now store all data in the cloud!

---

## 🎓 How to Explain This Project to Your Internship Mentor

1. **Architecture Separation:**
   - *"The frontend and backend are completely decoupled. The frontend is built with React and Vite, acting as a Single Page Application (SPA), while the backend is an Express.js REST API running on Node.js."*
2. **True Persistent Storage:**
   - *"We do not rely on local arrays or browser localStorage. All data is written to a MongoDB database via Mongoose ODM schemas, ensuring data persistence across page reloads and multiple client sessions."*
3. **CORS & Environment Variables:**
   - *"To allow the Vite frontend (`:5173`) to communicate with the Express server (`:5000`) across origins, we configured CORS middleware. Sensitive variables like ports and MongoDB URIs are isolated in `.env` files and excluded from version control via `.gitignore`."*
4. **Resilience & User Experience:**
   - *"The UI handles real-world states: skeleton loaders while fetching, empty states when no records exist, client-side input validation before submission, danger confirmation modals before deletion, and non-blocking toast notifications for instant feedback."*
