import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function home() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`);
      console.log(response.data);
      setSuccess(response.data?.message || "Logged out Successfully");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      setError(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (editingItem) {
        response = await axios.post(`${API_URL}/edit-list`, {
          id: editingItem.id,
          title,
          status,
        });
        setSuccess(response.data?.message || "List Updated successfully");
      } else {
        response = await axios.post(`${API_URL}/add-list`, {
          title,
          status,
        });
        setSuccess(response.data?.message || "List Added successfully");
      }
      console.log(response.data);
      fetchList();
      setTitle("");
      setStatus("");
      setEditingItem(null);
      setShowForm(false);
      navigate("/home");
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      setError(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/delete-list`, { id });
      console.log(response.data);
      setSuccess(response.data?.message || "List Deleted successfully");
      fetchList();
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      setError(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setStatus(item.status);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleOpen = (item) => {
    navigate('/list-item', { state: { listId: item.id, listTitle: item.title } });
  };
/*   const handleEditlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/edit-list`, {
        title,
        stats,
      });
      setLists(response.data);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  }; */

  const fetchList = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-list`);
      console.log(response.data);
      setLists(response.data.list);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      setError(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <button
            onClick={handleLogout}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-4">{success}</p>
        )}

        <div className="bg-pink-50 border border-pink-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Lists</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2"
            >
              + Add New List
            </button>
          </div>

          {lists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No lists yet. Create your first list to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-pink-300">
                <thead>
                  <tr className="bg-pink-200">
                    <th className="border border-pink-300 px-4 py-2 text-left">Title</th>
                    <th className="border border-pink-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-pink-300 px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lists.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-pink-50">
                      <td className="border border-pink-300 px-4 py-2">{item.title}</td>
                      <td className="border border-pink-300 px-4 py-2">
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 text-xs">
                          {item.status}
                        </span>
                      </td>
                      <td className="border border-pink-300 px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleOpen(item)}
                          className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 text-sm"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-pink-400 hover:bg-pink-500 text-white px-3 py-1 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-pink-300 hover:bg-pink-400 text-white px-3 py-1 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {showForm && (
            <div className="mb-6 p-4 bg-pink-100 border border-pink-300">
              <h3 className="text-lg font-bold mb-4">
                {editingItem ? "Edit List" : "Create New List"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">List Title</label>
                  <input
                    type="text"
                    placeholder="Enter list name..."
                    className="w-full px-3 py-2 border border-pink-300 focus:outline-none focus:border-pink-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-pink-300 focus:outline-none focus:border-pink-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select status...</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setTitle("");
                    setStatus("");
                  }}
                  className="px-4 py-2 bg-pink-200 text-pink-800 hover:bg-pink-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-pink-600 text-white hover:bg-pink-700"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default home;
