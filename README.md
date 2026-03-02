# fullstack-todo-app

A modern and responsive fullstack Todo application built using the PERN stack (PostgreSQL, Express, React, Node.js).

---

## 🚀 Features

-  Create new tasks
-  Edit existing tasks
-  Delete tasks
-  Toggle completed status
-  Real-time UI updates
-  RESTful API
-  Clean UI with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- React
- Axios
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- PostgreSQL

---

## 📂 Project Structure

```
root
 ├── client   # React frontend
 └── server   # Express backend
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/fullstack-todo-app.git
```

### 2️⃣ Backend Setup

```
cd server
npm install
```

Create a `.env` file:

```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
```

Start server:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 📌 API Endpoints

| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| GET    | /todos          | Get all todos       |
| POST   | /todos          | Create new todo     |
| PATCH  | /todos/:id      | Update todo         |
| DELETE | /todos/:id      | Delete todo         |

---

## 💡 Future Improvements

- Authentication system
- Drag and drop reordering
- Filtering (All / Completed / Active)
- Deployment (Render / Vercel)

---

## 👩‍💻 Author

Built with ❤️ by Salma
