const db = require('../models/db.json');

function getUser(req, res) {
  let userButWithCondition = db.users.map(user => {
    return user.age <= req.query.userAge ? user : {};
  });

  res.json({
    user: userButWithCondition,
  });
}

function postUser(req, res) {
  res.json({
    msg: 'ok',
  });
}

module.exports = {
  getUser,
  postUser,
};
