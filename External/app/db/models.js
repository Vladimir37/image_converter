var Sequelize = require('sequelize');

var sequelize = new Sequelize('comparison', 'root', 'node_db', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

sequelize.authenticate().then(function() {
    console.log('Connect to DB created!');
}, function(err) {
    console.log('Connection error: ' + err);
});

var tables = {};

tables.users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.TEXT,
    pass: Sequelize.TEXT,
    status: Sequelize.INTEGER
});

tables.images = sequelize.define('images', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    width: Sequelize.INTEGER,
    height: Sequelize.INTEGER,
    user: Sequelize.INTEGER,
    file: Sequelize.TEXT('long'),
    ext: Sequelize.TEXT
});

for(var table in tables) {
    tables[table].sync().then(function() {
        //success
    }, function(err) {
        console.log('Database error: ' + err);
    });
}

module.exports = tables;