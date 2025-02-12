const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;


app.get("/ping", (req, res) => {
  res.send("Pong! 🏓");
});


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
