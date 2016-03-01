var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'app/db/database.sqlite',
    logging: false
});

sequelize.authenticate().then(function() {
    console.log('Connect to DB created!');
}, function(err) {
    console.log('Connection error: ' + err);
});

var users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.TEXT,
    pass: Sequelize.TEXT,
    status: Sequelize.INTEGER
});

users.sync().then(function() {
    //success
}, function(err) {
    console.log('Database error: ' + err);
});

module.exports = users;