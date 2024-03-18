module.exports = app => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();
  // Create a new user
  router.post("/", users.create);
  // Retrieve all users
  router.get("/", users.findAll);
  // Delete a user with id
  router.delete("/:id", users.delete);
  app.use('/api/users', router);
  router.get("/test", (req, res) => {
  res.send("Test route for users");
});
};
