const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  db.query("SELECT DATABASE() AS dbName")
    .then(([rows]) => {
      console.log("MySQL connected:", rows[0].dbName);
    })
    .catch((error) => {
      console.error("MySQL connection failed:", error.message);
    });
});