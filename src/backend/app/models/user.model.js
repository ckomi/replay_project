module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    for_city: {
      type: Sequelize.STRING
    },
    user_name: {
      type: Sequelize.STRING
    },
    user_password: {
      type: Sequelize.STRING
    }
  });
  return User;
};
