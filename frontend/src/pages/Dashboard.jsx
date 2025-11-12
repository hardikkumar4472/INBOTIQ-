import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import ItemForm from "../components/ItemForm";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [itemsData, setItemsData] = useState({ items: [], page: 1, total: 0, pages: 0 });
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const limit = 6;

  const fetchItems = async (p = 1, q = "") => {
    setLoading(true);
    try {
      const res = await api.get("/items", { params: { page: p, limit, search: q } });
      setItemsData(res.data);
    } catch (err) {
      console.error("fetch items error", err);
      alert(err?.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(page, query);

  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems(1, query);
  };

  const handleCreate = async (payload) => {
    try {
      await api.post("/items", payload);
      fetchItems(page, query);
    } catch (err) {
      alert(err?.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await api.put(`/items/${editing._id}`, payload);
      setEditing(null);
      fetchItems(page, query);
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchItems(page, query);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="app-container py-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome, {user?.name} <span className="text-sm font-normal">({user?.role})</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl shadow-xl ${
            theme === 'dark' 
              ? 'bg-gray-800/80 backdrop-blur-md' 
              : 'bg-white/80 backdrop-blur-md'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
          <ItemForm onSubmit={handleCreate} />
        </motion.div>

        {}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl shadow-xl ${
            theme === 'dark' 
              ? 'bg-gray-800/80 backdrop-blur-md' 
              : 'bg-white/80 backdrop-blur-md'
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Search Items</h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className={`flex-1 p-3 rounded-lg border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Search title, description or tags" 
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg"
            >
              Search
            </motion.button>
          </form>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {itemsData.items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    No items found
                  </motion.div>
                ) : (
                  itemsData.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      layout
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-sm mb-2 opacity-75">{item.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.tags?.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs opacity-60">
                            By: {item.owner?.name} ({item.owner?.role})
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditing(item)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                          >
                            Edit
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {}
              {itemsData.pages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between mt-6 pt-4 border-t"
                >
                  <div className="text-sm opacity-75">
                    Page {itemsData.page} of {itemsData.pages}
                  </div>
                  <div className="space-x-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
                    >
                      Prev
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={page >= (itemsData.pages || 1)}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50"
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
              <ItemForm initial={editing} onSubmit={handleUpdate} submitLabel="Update" />
              <div className="mt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}