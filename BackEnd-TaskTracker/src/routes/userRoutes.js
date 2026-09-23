const express = require("express");
const { authenticate, requireRole } = require("../middleware/authMiddleware");
const { me, getUsers, deleteUser, createAdmin } = require("../controllers/userController");
const router = express.Router();
router.get("/me", authenticate, me);
router.get("/", authenticate, requireRole("admin"), getUsers);
router.delete("/:id", authenticate, requireRole("admin"), deleteUser);
router.post("/promote", authenticate, requireRole("admin"), createAdmin);
module.exports = router;
