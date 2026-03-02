import { useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { API_URL } from "./api.js";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching from:", `${API_URL}/todos`); // Debug
      
      const res = await axios.get(`${API_URL}/todos`, {
        timeout: 5000, // Timeout de 5 secondes
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log("Response data:", res.data); // Debug
      
      if (Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        console.error("Data is not an array:", res.data);
        setError("Invalid data format received from server");
        setTodos([]);
      }
    } catch (err) {
      console.error("Error details:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Server is not responding.");
      } else if (err.response) {
        // Le serveur a répondu avec un code d'erreur
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        // La requête a été faite mais pas de réponse
        setError("Cannot connect to server. Make sure the backend is running on port 4000.");
      } else {
        setError("Failed to fetch todos. Please try again later.");
      }
      
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/todos`, {
        description: description.trim(),
        completed: false,
      });
      setTodos([...todos, res.data]);
      setDescription("");
    } catch (err) {
      console.error(err.message);
      setError("Failed to add todo. Please try again.");
    }
  };

  const saveEdit = async (id) => {
    try {
      setError(null);
      const currentTodo = todos.find((todo) => todo.todo_id === id);
      const trimmedText = editedText.trim();

      if (currentTodo.description === trimmedText) {
        setEditingTodo(null);
        setEditedText("");
        return;
      }

      await axios.patch(`${API_URL}/todos/${id}`, { description: trimmedText });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, description: trimmedText } : todo
        )
      );
      setEditingTodo(null);
      setEditedText("");
    } catch (err) {
      console.error(err.message);
      setError("Failed to update todo. Please try again.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const toggleCompleted = async (id) => {
    try {
      setError(null);
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.patch(`${API_URL}/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.error(err.message);
      setError("Failed to update todo. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-start p-6">
      <div className="bg-gray-800 rounded-3xl shadow-xl w-full max-w-lg p-8 mt-12">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          My Todo App
        </h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-xl mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <button 
              onClick={getTodos}
              className="mt-2 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={onSubmitForm} className="flex gap-2 mb-6">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 bg-gray-700 text-white"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </form>

        {/* Liste des todos */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-400 text-center">Loading tasks...</p>
          ) : todos.length === 0 && !error ? (
            <p className="text-gray-400 text-center">
              No tasks available. Add a new task!
            </p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {todos.map((todo) => (
                <div key={todo.todo_id}>
                  {editingTodo === todo.todo_id ? (
                    <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-xl">
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600 text-white"
                      />
                      <button
                        onClick={() => saveEdit(todo.todo_id)}
                        className="bg-green-500 hover:bg-green-600 p-2 rounded-md text-white transition-colors"
                      >
                        <MdOutlineDone size={20} />
                      </button>
                      <button
                        onClick={() => setEditingTodo(null)}
                        className="bg-gray-500 hover:bg-gray-600 p-2 rounded-md text-white transition-colors"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-xl shadow hover:bg-gray-600 transition-colors">
                      <div className="flex items-center gap-x-4 flex-1 overflow-hidden">
                        <button
                          onClick={() => toggleCompleted(todo.todo_id)}
                          className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                          {todo.description}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTodo(todo.todo_id);
                            setEditedText(todo.description);
                          }}
                          className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white font-medium transition-colors"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.todo_id)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white font-medium transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;