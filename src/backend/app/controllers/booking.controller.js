const db = require("../models");
const Booking = db.bookings;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

// Create and Save a new Booking
exports.create = (req, res) => {
    console.log("Izvrsava se funkcija create na backendu!");
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a Booking
    const booking = {
      city: req.body.city,
      name: req.body.name,
      phone_number: req.body.phone_number,
      date: req.body.date,
      payment_type: req.body.payment_type,
      total_people: req.body.total_people,
      total_money: req.body.total_money
    };
    console.log("New booking data:", booking);
    // Save Booking in the database
    Booking.create(booking)
      .then(data => {
        console.log("Booking created:", data);
        res.send(data);
      })
      .catch(err => {
        console.log("Error creating booking:", err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Booking."
        });
      });
  };

// Retrieve all Booking from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Booking.findAll({ where: condition,  order: sequelize.literal('date ASC') })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Booking."
        });
      });
  };

// Find bookings between today and next 90 days
exports.findUpcomingBookings = (req, res) => {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 90);
  Booking.findAll({
    where: {
      date: {
        [Op.between]: [today, endDate]
      }
    },
    order: sequelize.literal('date ASC')
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No bookings found between ${today.toISOString()} and ${endDate.toISOString()}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving bookings between specified dates: " + err.message
      });
    });
};

// Update a Booking by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Booking.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Booking was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Booking with id=${id}. Maybe Booking was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Booking with id=" + id
        });
      });
  };

// Delete a Booking with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Booking.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Booking was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Booking with id=${id}. Maybe Booking was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Booking with id=" + id
        });
      });
  };
