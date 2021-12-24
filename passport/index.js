const passport = require('passport');
const local = require('./localStrategy');
const facebook = require('./facebookStrategy');
const google = require('./googleStrategy');
const apple = require('./appleStrategy');
const User = require('../models/user');

module.exports = () =>{

    passport.serializeUser((user, done) =>{
        done(null, user);
    });
            
    passport.deserializeUser((user, done) =>{
        done(null, user);
    });

    local();
    facebook();
    google();
    apple();
};