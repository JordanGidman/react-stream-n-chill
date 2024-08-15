const express = require("express");
const app = express();

app.get("/api", (req, res) => {
  res.json({ users: ["one", "two", "three"] });
});

app.listen(5000, () => {
  console.log("Server Running on 5000");
});
