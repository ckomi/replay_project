module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define("booking", {
    city: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATEONLY
    },
    payment_type: {
      type: Sequelize.STRING
    },
    total_people: {
      type: Sequelize.INTEGER
    },
    total_money: {
      type: Sequelize.INTEGER
    }
  });
  return Booking;
};
