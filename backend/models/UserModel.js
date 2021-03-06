var db = require('../controllers/dbConnector');

function User(userData) {
    this.username = userData.username;
    this.password = userData.password;
    this.email = userData.email;
    this.name = {first: userData.first_name, last: userData.last_name};
    this.dob = userData.dob;
    this.gender = userData.gender;
    this.location = {city: userData.city, state: userData.state, country: userData.country};
    this.education = userData.education;
    this._uid = userData.uid;
    this._auth = userData.authtoken;
}

// Access the uid because it's private
User.prototype.getId = function() {
    var query = db.query('SELECT uid FROM users WHERE username = ?', {replacements: [this.username]})
    return query;
}

// Create a user, update the uid of the User object
User.prototype.create = function() {
    // Insert the new user into the db
    var query = db.query('INSERT INTO users (username, password, first_name, last_name, email, dob, city, state, country, education) VALUES (?,?,?,?,?,to_date(?, \'MM DD YYYY\'),?,?,?,?)', {replacements: [this.username, this.password, this.name.first, this.name.last, this.email, this.dob, this.location.city, this.location.state, this.location.country, this.education], type:'INSERT'});
    return query;
}


User.prototype.getAuthToken = function() {
    var query = db.query('SELECT authtoken FROM auth WHERE uid = ?', {replacements: [this._uid]});
    return query;
}

//Create an entry for a new user and his Bantrs auth token
User.prototype.createAuthToken = function() {
    var query = db.query('INSERT INTO auth VALUES (?, ?)', {replacements: [this._uid, this._auth], type:'INSERT'});
    return query;
}

User.prototype.addFriend = function(friend_id) {
    var query = db.query('INSERT INTO friends VALUES (?, ?)', {replacements: [this._uid, friend_id]});
    return query;
}

User.prototype.getFriends = function() {
    var query = db.query('SELECT u.uid, u.username, u.first_name, u.last_name, u.email from users u, friends f where u.uid = f.friend_id and f.uid = ?', {replacements: [this._uid]});
    return query;
}

// Get a User object by the username
User.getByUsername = function(username) {
    // Send the query to the dbConnector
    var query = db.query("SELECT uid, username, email, first_name, last_name, city, state, dob FROM users where username = ?", {replacements: [username]});
    return query;
}

// Get the stored hashed password of a user
User.getHash = function(username) {
    var query = db.query('SELECT password FROM users WHERE username = ?', {replacements: [username]});
    return query;
}

// Get a User object by the banstrsauth
User.getByAuthToken = function(auth){
    // var query = db.query('SELECT id, username, email FROM users WHERE uid = (select uid where banterauth = ? FROM auth)', {replacements: [bantrsauth]})
    var query = db.query('SELECT u.username, u.uid, u.email, u.first_name, u.last_name FROM users u NATURAL JOIN auth a WHERE a.authtoken = ?',{replacements:[auth]});
    return query;
}

User.getAlbums = function(uid){
    var query = db.query('SELECT album_id, name from albums where owner = ?', {replacements: [uid]});
    return query;
}

User.increment = function(uid) {
    db.query('UPDATE users SET activity = activity + 1 WHERE uid = ?', {replacements:[uid], type:'UPDATE'});
}

module.exports = User;
