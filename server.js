require("dotenv").config();
const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const { sequelize } = require("./models");

const app = express();
const port = 8800;

app.use(express.json());

app.use(cors());
app.use("/api/v1", routes);
app.get("/", async (req, res) => {
  return res.status(200).send({
    message: `Welcome to User Management \n Endpoints available at http://localhost:${port}/api/v1`,
  });
});

/** Error handling middleware */
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message ? error.message : "Internal server error",
  });
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server is running on port ${port}`);
});
