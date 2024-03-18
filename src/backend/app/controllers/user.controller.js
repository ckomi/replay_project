const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const bcrypt = require('bcryptjs');

// Create and Save a new user
exports.create = (req, res) => {
    console.log("Izvrsava se funkcija create na backendu!");
    // Validate request
    if (!req.body.user_name || !req.body.user_password) {
      res.status(400).send({
        message: "Username and password are required!"
      });
      return;
    }
    // Generate salt and hash password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.user_password, salt, (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                res.status(500).send({
                    message: "Error occurred while hashing password."
                });
                return;
            }
            // Create a user with hashed password
            const user = {
                for_city: req.body.for_city,
                user_name: req.body.user_name,
                user_password: hash // Use hashed password
            };
            console.log("New user data:", user);
            // Save user in the database
            User.create(user)
              .then(data => {
                console.log("user created:", data);
                res.send(data);
              })
              .catch(err => {
                console.log("Error creating user:", err);
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the user."
                });
              });
        });
    });
};

exports.findAll = (req, res) => {
  User.findAll()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

  // Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "user was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete user with id=" + id
      });
    });
};
