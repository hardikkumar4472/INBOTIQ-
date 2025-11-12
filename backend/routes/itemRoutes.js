import express from "express";
import {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem
} from "../controllers/itemController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createItem);      
router.get("/", listItems);        
router.get("/:id", getItem);       
router.put("/:id", updateItem);    
router.delete("/:id", deleteItem); 

export default router;