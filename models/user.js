const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user",{
  id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
  },
  username:Sequelize.STRING,
  email:Sequelize.STRING,
});

module.exports = User;