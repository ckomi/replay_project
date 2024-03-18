module.exports = app => {
  const bookings = require("../controllers/booking.controller.js");
  var router = require("express").Router();
  // Create a new booking
  router.post("/", bookings.create);
   // Retrieve all bookings
   router.get("/", bookings.findAll);
   // Retrieve bookings for the next 90 days
   router.get("/upbookings", bookings.findUpcomingBookings);
  // Update a booking with id
  router.put("/:id", bookings.update);
  // Delete a booking with id
  router.delete("/:id", bookings.delete);
  app.use('/api/bookings', router);
};
