const LoginSessions = require('../models/LoginSessions.js');

class LoginSessionsController {
  async getAll(req, res) {
    try {
      const loginSessions = await LoginSessions.find().sort({ createdAt: 'desc' }).populate('user').exec();

      res.json(loginSessions);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Can't get loginSessions",
      });
    }
  }
  async actionsTest(req, res) {
    try {
      res.json({
        message: 'actionsTest success',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Can't get loginSessions",
      });
    }
  }
}

module.exports = new LoginSessionsController();
