const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');
module.exports = () =>{
    console.log('in local check ');
    passport.use(new localStrategy({
        usernameField : 'userEmail',
        passwordField : 'pwd',
    }, async (userEmail, pwd, done) =>{
        try {
            const user = await User.findOne( {where : { userEmail : userEmail}, raw:true,nest : true,});

            //데이터 파싱
            user.userAttribute = JSON.parse(user.userAttribute);

            console.log(JSON.stringify(user));
            if(user){
                const result = await bcrypt.compare(pwd, user.pwd);
                if(result){
                    done(null, user);
                }else{
                    done(null, false, {message: 'incorrect password'})
                }
            } else {
                done(null, {message: 'no member'})
            }
        }catch(err){
            console.error(err);
            done(err);
        }
    }));
};