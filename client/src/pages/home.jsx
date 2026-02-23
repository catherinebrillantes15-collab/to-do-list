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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <Header onLogout={handleLogout} />
      <div className="p-8">

        {error && (
          <p className="text-red-600 text-sm mb-6 p-4 bg-red-50 rounded-2xl">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-6 p-4 bg-green-50 rounded-2xl">{success}</p>
        )}

        <div className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-pink-600">Lists</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-bold transition"
            >
              + Add New List
            </button>
          </div>

          {lists.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-white rounded-3xl">
              <p className="text-gray-600 text-lg">No lists yet. Create your first list to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((item, index) => (
                <div key={item.id || index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-pink-500">
                  <h3 className="text-xl font-bold text-pink-600 mb-2">{item.title}</h3>
                  <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {item.status}
                  </span>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleOpen(item)}
                      className="flex-1 min-w-fit px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold transition"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 min-w-fit px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 min-w-fit px-4 py-2 bg-pink-300 hover:bg-pink-400 text-white rounded-full font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showForm && (
            <div className="mt-8 p-8 bg-gradient-to-r from-pink-50 to-white rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 text-pink-600">
                {editingItem ? "Edit List" : "Create New List"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm mb-2 text-pink-700 font-semibold">List Title</label>
                  <input
                    type="text"
                    placeholder="Enter list name..."
                    className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-pink-700 font-semibold">Status</label>
                  <select
                    className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
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
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    setTitle("");
                    setStatus("");
                  }}
                  className="px-6 py-2 bg-pink-100 text-pink-700 hover:bg-pink-200 rounded-full font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 rounded-full font-semibold transition"
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
