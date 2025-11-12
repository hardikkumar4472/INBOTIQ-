import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="app-container min-h-screen flex items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${
          theme === 'dark' 
            ? 'bg-gray-800/80 backdrop-blur-md' 
            : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Welcome Back
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              {...register("email", { required: true })} 
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">Email required</p>}
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              {...register("password", { required: true })} 
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">Password required</p>}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                "Login"
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}