var Sequelize = require('sequelize');
var config = require('../config');
var sequelize = new Sequelize(config.db.type + '://' + config.db.username + ':' + config.db.password + '@' + config.db.host + '/' + config.db.name, {dialect:'postgres'});
/*
* This is basically a config file for the pg node package
* TODO
* Implement the connection to the database
*/

function db() {}

db.query = function(query,params){
    var query = sequelize.query(query, params);
    return query;
}

db.chain = function(queries) {
    var chain = new Sequelize.Utils.QueryChainer();
    for (q in queries) {
        chain.add(sequelize.query(queries[q].string, queries[q].rep));
    }
    return chain
}

module.exports = db;
