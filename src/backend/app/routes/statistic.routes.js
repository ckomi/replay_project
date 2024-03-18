module.exports = app => {
  const statistics = require("../controllers/statistic.controller.js");
  var router = require("express").Router();

  // Retrieve all users
  // router.get("/", statistics.findAll);
  router.get("/", statistics.getTotalStat);
  router.get("/totalPeopleByMonth", statistics.getPeopleByMonth);
  router.get("/totalMoneyByMonth", statistics.getMoneyByMonth);
  router.get("/payTypeSumMonth", statistics.getSumPayTypeMonthly);
  router.get("/peopleByCity", statistics.getPeopleByCity);
  router.get("/allInfoByCity", statistics.getInfoByCity);
  app.use('/api/statistics', router);

  router.get("/test", (req, res) => {
  res.send("Test route for users");
});
};

