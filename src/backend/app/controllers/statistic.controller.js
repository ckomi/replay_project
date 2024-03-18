const db = require("../models");
const { Sequelize } = require("../models").sequelize;
const Booking = db.bookings;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const today = new Date();

// ===========================================================================
// ===================== TOTAL BOOKINGS PEOPLE MONEY =========================
// ===========================================================================
exports.getTotalStat = async (req, res) => {
  try {
    const totalBookings = await Booking.count();
    const totalPeopleResult = await Booking.sum('total_people');
    const totalPeople = totalPeopleResult ? totalPeopleResult : 0;
    const totalMoneyResult = await Booking.sum('total_money');
    const totalMoney = totalMoneyResult ? totalMoneyResult : 0;
    res.json({
      totalBookings,
      totalPeople,
      totalMoney
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Some error occurred while retrieving statistics."
    });
  }
};
// ===========================================================================
// ======================== TOTAL PEOPLE BY MONTH ============================
// ===========================================================================
exports.getPeopleByMonth = async (req, res) => {
  try {
    const peopleByMonth = await Booking.findAll({
      attributes: [
        [Sequelize.literal('YEAR(date)'), 'year'],
        [Sequelize.literal('MONTH(date)'), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('total_people')), 'totalPeople']],
      where: {
      date: {[Op.lte]: today}},group: ['year', 'month'],
      order: [
        [Sequelize.literal('year DESC')],
        [Sequelize.literal('month DESC')]]
    });
    res.json(peopleByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Some error occurred while retrieving people by month."
    });
  }
};

// ===========================================================================
// ======================== TOTAL MONEY BY MONTH =============================
// ===========================================================================
exports.getMoneyByMonth = async (req, res) => {
  try {
    const moneyByMonth = await Booking.findAll({
      attributes: [
        [Sequelize.literal('YEAR(date)'), 'year'],
        [Sequelize.literal('MONTH(date)'), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('total_money')), 'totalMoney']],
      where: {date: {[Op.lte]: today}},
      group: ['year', 'month'],
      order: [[Sequelize.literal('year DESC')],[Sequelize.literal('month DESC')]]
    });
    res.json(moneyByMonth);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Some error occurred while retrieving money by month."
    });
  }
};

// ===========================================================================
// ===================== PAYMENT TYPE SUM BY MONTHS ==========================
// ===========================================================================
exports.getSumPayTypeMonthly = async (req, res) => {
  try {
    const sumPayTypeMonthly = await Booking.findAll({
      attributes: [
        [Sequelize.literal('YEAR(date)'), 'year'],
        [Sequelize.literal('MONTH(date)'), 'month'],
        'payment_type',
        [Sequelize.fn('SUM', Sequelize.col('total_money')), 'totalMoney']],
      where: { date: { [Op.lte]: today } },
      group: ['year', 'month', 'payment_type'],
      order: [[Sequelize.literal('year DESC')], [Sequelize.literal('month DESC')], ['payment_type']],
    });
    const result = [];
    sumPayTypeMonthly.forEach((item) => {
      const { year, month, payment_type, totalMoney } = item.toJSON();
      let found = result.find(data => data.month === month && data.year === year);
      if (!found) {
        found = {month, year, typesData: {}};
        result.push(found);
      }
      found.typesData[payment_type] = totalMoney;
    });
    // Popunite sve vrste plaćanja sa vrednošću 0 ako nisu pronađene za taj mesec
    const paymentTypes = ['Cash', 'GetYourGuide', 'Viator', 'Direct', 'Others'];
    result.forEach((data) => {
      paymentTypes.forEach((type) => {
        if (!data.typesData[type]) {
          data.typesData[type] = '0';
        }
      });
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Some error occurred while retrieving payment type sum by months."
    });
  }
};

// ===========================================================================
// ======================== Total People By City =============================
// ===========================================================================
exports.getPeopleByCity = async (req, res) => {
  try {
    const today = new Date();
    const peopleByCity = await Booking.findAll({
      attributes: [
        [Sequelize.literal('YEAR(date)'), 'year'],
        [Sequelize.literal('MONTH(date)'), 'month'],
        'city',
        [Sequelize.fn('SUM', Sequelize.col('total_people')), 'totalPeople']],
      where: {date: {[Op.lte]: today}},
      group: ['year', 'month', 'city'],
      order: [[Sequelize.literal('year DESC')], [Sequelize.literal('month DESC')], ['city']],
    });
    const result = [];
    peopleByCity.forEach((item) => {
      const { year, month, city, totalPeople } = item.toJSON();
      let found = result.find(data => data.month === month && data.year === year);
      if (!found) {
        found = { month, year, cityData: {}};
        result.push(found);
      }
      found.cityData[city] = totalPeople;
    });
    // Dodajte sve gradove koji postoje u bazi
    const allCities = ['Belgrade', 'Lisabon', 'Budva', 'Barcelona'];
    result.forEach((data) => {
      allCities.forEach((city) => {
        if (!data.cityData[city]) {
          data.cityData[city] = '0';
        }
      });
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Some error occurred while retrieving people by city."
    });
  }
};

// ===========================================================================
// ============== Total Bookings People Money By City ========================
// ===========================================================================
exports.getInfoByCity = async (req, res) => {
  try {
    const today = new Date();
    const allCities = ['Belgrade', 'Lisabon', 'Budva', 'Barcelona'];
    const result = [];

    const endYear = today.getFullYear();
    const endMonth = today.getMonth() + 1; // Povećavamo za 1 jer su meseci bazirani na nulom

    for (let year = endYear; year >= endYear - 1; year--) { // Prolazimo kroz poslednju i prethodnu godinu
      const endMonthOfYear = (year === endYear) ? endMonth : 12; // Ako je trenutna godina, koristimo trenutni mesec, inače koristimo sve mesece

      for (let month = endMonthOfYear; month >= 1; month--) { // Prolazimo kroz mesece unazad
        const cityData = {};
        for (const city of allCities) {
          cityData[city] = {
            totalBookings: '0',
            totalPeople: '0',
            totalMoney: '0'
          };
        }

        const bookings = await Booking.findAll({
          attributes: [
            'city',
            [sequelize.fn('SUM', sequelize.col('total_people')), 'totalPeople'],
            [sequelize.fn('SUM', sequelize.col('total_money')), 'totalMoney'],
            [sequelize.fn('COUNT', sequelize.col('*')), 'totalBookings'] // Broj rezervacija
          ],
          where: {
            [Op.and]: [
              sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
              sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month)
            ]
          },
          group: ['city'],
          raw: true // Da bismo dobili čiste JSON podatke
        });

        bookings.forEach(booking => {
          const city = booking.city;
          cityData[city].totalBookings = booking.totalBookings.toString();
          cityData[city].totalPeople = booking.totalPeople.toString();
          cityData[city].totalMoney = booking.totalMoney.toString();
        });

        result.push({ month, year, AllData: cityData });
      }
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Some error occurred while retrieving info by city."
    });
  }
};



