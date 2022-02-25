const Sequelize = require("sequelize");

module.exports = new Sequelize("node-complete","root","kjfsdev142",{
  dialect:"mysql",
  host:"localhost",
});