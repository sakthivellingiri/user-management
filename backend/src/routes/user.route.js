import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadUser, getAllUser, getById, updateUserById, deleteUserById, exportUser } from "../controller/users.controller.js";

const router =  express.Router()

router.post("/upload-users", protectRoute, uploadUser); 
router.get("/users", protectRoute, getAllUser); 
router.get("/user/:id", protectRoute, getById); 
router.put("/user/:id", protectRoute, updateUserById);
router.delete("/user/:id", protectRoute, deleteUserById);
router.get("/export-users",protectRoute, exportUser );

export default router;