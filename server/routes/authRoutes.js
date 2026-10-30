const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileupload");
const auth = require("../middleware/auth");
const { register, login, getCurrentUser, uploadProfileImage, logout } = require("../controllers/authControllers");

router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getCurrentUser );
router.post("/upload-profile-image", auth, upload.single("profile_image"), uploadProfileImage);

module.exports = router;