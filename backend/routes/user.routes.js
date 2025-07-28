const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateUserProfile, updateProfilePicture, selectInsurancePlan, updateInsuranceStatus, findUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile-pictures'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `user-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", findUser);
router.get("/", getAllUsers);
router.put("/profile/:id", updateUserProfile);
router.put("/:id/profile-picture", authenticateToken, upload.single('profilePicture'), updateProfilePicture);
router.post("/select-insurance", authenticateToken, selectInsurancePlan);
router.post("/update-insurance", authenticateToken, updateInsuranceStatus);

module.exports = router;
