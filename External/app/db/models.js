var Sequelize = require('sequelize');

var db = require('../../db.json');

var sequelize = new Sequelize(db.database, db.name, db.pass, {
    dialect: db.dialect,
    host: db.host,
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
    ext: Sequelize.TEXT,
    // image data
    name: Sequelize.TEXT,
    gender: Sequelize.INTEGER,
    nationality: Sequelize.TEXT,
    dob: Sequelize.DATE
});

tables.comparison = sequelize.define('comparison', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: Sequelize.INTEGER,
    completed: Sequelize.BOOLEAN,
    one: Sequelize.TEXT('long'),
    two: Sequelize.TEXT('long'),
    three: Sequelize.TEXT('long'),
    fourth: Sequelize.TEXT('long'),
    fift: Sequelize.TEXT('long'),
    oneId: Sequelize.INTEGER,
    twoId: Sequelize.INTEGER,
    threeId: Sequelize.INTEGER,
    fourthId: Sequelize.INTEGER,
    fiftId: Sequelize.INTEGER
});

for(var table in tables) {
    tables[table].sync().then(function() {
        //success
    }, function(err) {
        console.log('Database error: ' + err);
    });
}

module.exports = tables;