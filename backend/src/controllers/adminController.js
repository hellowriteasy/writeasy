const AdminService = require("../src/services/AdminService");

const AdminController = {
  async modifySettings(req, res) {
    try {
      const result = await AdminService.modifySettings(req.body.settings);
      res.json(result);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  async viewReports(req, res) {
    try {
      const reports = await AdminService.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = AdminController;
