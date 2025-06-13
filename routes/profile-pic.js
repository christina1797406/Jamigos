/* for profile pic storage */
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/", (req, res) => {
  const { username, email, image } = req.body;

  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const extension = image.match(/^data:image\/(\w+);base64,/)[1];
    const buffer = Buffer.from(base64Data, "base64");

    const filename = `${Date.now()}-avatar.${extension}`;
    const filePath = path.join(__dirname, "..", "public", "uploads", filename);

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save image" });
      }
      res.json({ message: "Profile updated", avatarPath: `/uploads/${filename}` });
    });
  } else {
    res.json({ message: "Profile updated without image" });
  }
});

module.exports = router;
