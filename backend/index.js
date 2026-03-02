import express from "express";
import cors from "cors";
import todosRoutes from "./routes/todosRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Autoriser toutes les origines (développement uniquement)
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/todos", todosRoutes);
 


app.listen(4000, () => {
  console.log("Server started on port 4000");
});
 