import Joi from "joi";
import Item from "../models/Item.js";

const itemSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow("", null),
  tags: Joi.array().items(Joi.string()).optional()
});

export const createItem = async (req, res) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const item = await Item.create({ ...value, owner: req.userId });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listItems = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "10", 10)));
    const search = (req.query.search || "").trim();

    const filter = {};
    if (req.userRole !== "Admin") {
      filter.owner = req.userId;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("owner", "name email role");

    res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "name email role");
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (req.userRole !== "Admin" && item.owner._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (req.userRole !== "Admin" && item.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { error, value } = itemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    item.title = value.title;
    item.description = value.description || item.description;
    item.tags = value.tags || item.tags;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (req.userRole !== "Admin" && item.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Item.findByIdAndDelete(item._id); 

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};