const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
var corsOptions = {
  origin: ["http://localhost:4200", "https://2484-37-19-109-201.ngrok-free.app", "https://85e4-37-19-109-201.ngrok-free.app"]
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Endpoint za serviranje CSS fajla
app.get('/styles/indigo-pink.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css'); // Postavljanje MIME tipa na text/css
  res.sendFile(path.join(__dirname, 'node_modules/@angular/material/prebuilt-themes/indigo-pink.css'));
});

const db = require("./app/models");
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to booking application." });
});
// set port, listen for requests
require("./app/routes/booking.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/statistic.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
