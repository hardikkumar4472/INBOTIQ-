import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["User", "Admin"])
});

export default function Signup() {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "User" }
  });

  const onSubmit = async (data) => {
    try {
      await signup(data.name, data.email, data.password, data.role);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
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
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
        >
          Join Us
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {['name', 'email', 'password'].map((field, index) => (
            <motion.div
              key={field}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <label className="block text-sm font-medium mb-2 capitalize">
                {field}
              </label>
              <input 
                type={field === 'password' ? 'password' : 'text'}
                {...register(field)} 
                className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500' 
                    : 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
                } ${errors[field] ? 'border-red-500' : ''}`}
                placeholder={`Enter your ${field}`}
              />
              {errors[field] && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors[field].message}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2">Role</label>
            <select 
              {...register("role")} 
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500' 
                  : 'bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500'
              }`}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}