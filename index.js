const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");
const connection = require("./crudrepository.js");
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening in port ${server.address().port}`);
});

app.use(express.static(path.resolve(__dirname, "./frontend/build")));
app.use(express.static("frontend/build"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/**
 * Fetches all rows from the database.
 */
app.get("/contacts", async (req, res) => {
  try {
    let result = await connection.findAll();
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

/**
 * Fetches a row from database that matches the searched id.
 */
app.get("/contacts/:id([0-9]+)", async (req, res) => {
  try {
    let result = await connection.findById(req.params.id);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

/**
 * Deletes a row from database that matches the id.
 */
app.delete("/contacts/:id([0-9]+)", async (req, res) => {
  try {
    connection.deleteById(req.params.id);
    res.send(`Item deleted`);
  } catch (err) {
    console.log(err);
  }
});

/**
 * Saves a new row into the database.
 */
app.post("/contacts", async (req, res) => {
  try {
    await connection.save(req.body);
    res.send(`Item added to the database`);
  } catch (err) {
    console.log(err);
  }
});
