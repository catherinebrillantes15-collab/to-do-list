import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function listItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const { listId, listTitle } = location.state || {};
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [itemStatus, setItemStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await axios.post(`${API_URL}/get-items`, { listId });
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!desc.trim()) {
      setError("Please enter a description");
      return;
    }
    
    setAddingItem(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/add-items`, { listId, desc, status: itemStatus });
      setDesc("");
      setItemStatus("pending");
      setError("");
      setSuccess("Item added successfully");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      setError(error.response?.data?.message || "Error adding item");
    } finally {
      setAddingItem(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditDesc(item.description);
  };

  const handleSaveEdit = async () => {
    if (!editDesc.trim()) {
      setError("Description cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/edit-items`, { id: editingItem, desc: editDesc });
      setEditingItem(null);
      setError("");
      setSuccess("Item updated successfully");
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      setError(error.response?.data?.message || "Error updating item");
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditDesc("");
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/delete-items`, { id });
      setError("");
      setSuccess("Item deleted successfully");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(error.response?.data?.message || "Error deleting item");
    }
  };

  useEffect(() => {
    if (listId) {
      fetchItems();
    }
  }, [listId]);

  if (!listId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-6 text-lg">No list selected.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 rounded-full font-bold transition"
          >
            Back to Lists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <Header listTitle={listTitle} showBackButton={true} onBack={() => navigate('/home')} />
      <div className="p-8">

        {error && (
          <p className="text-red-600 text-sm mb-6 p-4 bg-red-50 rounded-2xl">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-6 p-4 bg-green-50 rounded-2xl">{success}</p>
        )}

        <div className="space-y-8">
          {/* Add Item Section */}
          <div className="bg-gradient-to-r from-pink-50 to-white p-8 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6 text-pink-600">Add New Item</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-pink-700 font-semibold">Description</label>
                <input
                  type="text"
                  placeholder="Title?"
                  className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  value={desc}
                  onChange={(e) => {
                    setDesc(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-pink-700 font-semibold">Status</label>
                <select
                  className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  value={itemStatus}
                  onChange={(e) => setItemStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button
                onClick={handleAddItem}
                disabled={addingItem}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-bold text-lg transition"
              >
                {addingItem ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-pink-600">Items ({items.length})</h2>
            {items.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-white rounded-3xl">
                <p className="text-gray-600 text-lg">No items yet. Add one above to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border-l-4 border-pink-500">
                    {editingItem === item.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-pink-50 to-white border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 rounded-full font-semibold transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-4 py-2 bg-pink-100 text-pink-700 hover:bg-pink-200 rounded-full font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-lg text-gray-800 mb-2">{item.description}</p>
                          <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.status}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="px-4 py-2 bg-pink-400 text-white hover:bg-pink-500 text-sm rounded-full font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-4 py-2 bg-pink-300 text-white hover:bg-pink-400 text-sm rounded-full font-semibold transition"
                          >
                            Delete
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
    </div>
  );
}

export default listItem;
