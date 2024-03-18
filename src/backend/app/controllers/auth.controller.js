const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

const maxLoginAttempts = 3;
const blockDurationInMinutes = 180;
const loginAttemptsMap = new Map();

exports.login = (req, res) => {
  const { user_name, user_password } = req.body;
  const userIpAddress = req.ip;
  const blockedInfo = loginAttemptsMap.get(userIpAddress);
  if (blockedInfo && blockedInfo.blockedUntil > Date.now()) {
    return res.status(418).send({ message: `Too many login attempts. Please try again later.` });
  }
  User.findOne({ where: { user_name: user_name } }).then(user => {
    if (!user) {
      incrementLoginAttempts(userIpAddress);
      return res.status(404).send({ message: 'Incorrect username.' });
    }
    bcrypt.compare(user_password, user.user_password, (err, result) => {
      if (err || !result) {
        incrementLoginAttempts(userIpAddress);
        return res.status(401).send({ message: 'Incorrect password.' });
      }
      resetLoginAttempts(userIpAddress);
      const token = jwt.sign({ id: user.id }, 'tajna_lozinka', { expiresIn: '1h' });
      res.status(200).send({ token, for_city: user.for_city });
    });
  }).catch(err => {
    incrementLoginAttempts(userIpAddress);
    res.status(500).send({ message: 'Error while logging in.' });
  });
};
function incrementLoginAttempts(userIpAddress) {
  const attempts = (loginAttemptsMap.get(userIpAddress)?.attempts || 0) + 1;
  if (attempts >= maxLoginAttempts) {
    const blockedUntil = Date.now() + blockDurationInMinutes * 60000;
    loginAttemptsMap.set(userIpAddress, { attempts, blockedUntil });
    setTimeout(() => {
      resetLoginAttempts(userIpAddress);
    }, blockDurationInMinutes * 60000);
  } else {
    loginAttemptsMap.set(userIpAddress, { attempts });
  }
}
function resetLoginAttempts(userIpAddress) {
  loginAttemptsMap.delete(userIpAddress);
}
exports.checkUserBlocked = (req, res) => {
  const userIpAddress = req.ip;
  const blockedInfo = loginAttemptsMap.get(userIpAddress);
  if (blockedInfo && blockedInfo.blockedUntil > Date.now()) {
    res.status(200).send({ blocked: true });
  } else {
    res.status(200).send({ blocked: false });
  }
};
