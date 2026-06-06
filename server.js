require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const routes = require("./routes");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use("/api", routes);

// Auto-save simulation (Advanced Task)
setInterval(() => {
  console.log(`[Auto-save] ${new Date().toISOString()} - health data synced`);
}, 60000);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
});