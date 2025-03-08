const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const patientRoute = require("./routes/patients");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
// Connect to MongoDB
dotenv.config();
const app = express();
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
//used to work with json requests
app.use(express.json());

app.use("/patients", patientRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, "0.0.0.0", () => {
  console.log("the server started on port 3000");
});
