import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  tags: z.string().optional()
});

export default function ItemForm({ initial = {}, onSubmit, submitLabel = "Save" }) {
  const { theme } = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial.title || "",
      description: initial.description || "",
      tags: (initial.tags || []).join(", ")
    }
  });

  return (
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit((data) => {
        const processed = { 
          ...data, 
          tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [] 
        };
        onSubmit(processed);
      })} 
      className="space-y-4"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium mb-2">Title</label>
        <input 
          {...register("title")} 
          className={`w-full p-3 rounded-lg border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500' 
              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          } ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter item title"
        />
        {errors.title && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.title.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea 
          {...register("description")} 
          className={`w-full p-3 rounded-lg border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500' 
              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          }`}
          rows="3"
          placeholder="Enter item description"
        />
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
        <input 
          {...register("tags")} 
          className={`w-full p-3 rounded-lg border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500' 
              : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          }`}
          placeholder="tag1, tag2, tag3"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {submitLabel}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}