const fs = require('fs');
require('dotenv').config();
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};

let sequelize;
if (env === 'development' || 'test') {
  sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config,
  );
} else {
  sequelize = new Sequelize(
      config.uri,
      {
        dialect: config.dialect,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });
}
console.log(config);
// eslint-disable-next-line max-len
console.log(`The current environment is a ${process.env.NODE_ENV} environment.`);

sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });

fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) &&
        (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      const model =
        require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
// npx sequelize db:migrate:undo --name 20180704124934-create-branch.js

