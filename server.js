const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Serve static files (HTML, CSS, JS, Songs)
app.use(express.static(path.join(__dirname)));

// API to send songs.json
app.get("/songs", (req, res) => {
  res.sendFile(path.join(__dirname, "songs.json"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
