const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const config = require('../config/config.json');

const { User } = require('../models');
module.exports = () =>{
    console.log('in facebook check ');
    passport.use(new FacebookStrategy({
        clientID : 1270909446709006,
        clientSecret : config.oauth.facebook.clientsecret,
        callbackURL : config.oauth.facebook.callbackurl,
        profileFields : ['id'],
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) =>{
                let user = await User.findOne( {where : { facebookID : profile.id}, raw:true,nest : true,} );
                console.log(JSON.stringify(profile)+'  ###########get id');

                if(user){
                    return done(null, user);
                }

                if(req.isAuthenticated())
                {
                    // 로그인한 User의 소셜 가입
                    await User.update(
                        { facebookID : profile.id },
                        { where : { userUID : req.session.passport.user.userUID } })
                    .then( (result) => {
                        req.user.facebookID = profile.id;
                        user = req.user;
                        return done(null, user);
                    })
                    .catch( (error) => {
                        return done(null, false);
                    });
                }
                else
                {
                    // 로그인 하지 않은 User 및 소셜 가입 이력이 없는 User
                    req.session.socialSignUpFlag = 'facebookSignUp';
                    req.session.socialId = profile.id;
                    req.session.save();
                    
                    return done(null, false);
                }

                /*
                const newUser = new User({ // 없으면 회원 생성
                    userEmail : 'testemail@testemail.com',
                    pwd : "asdasdasd",
                    userName: "sdfsdfsdf",
                    birth : "123",
                    userAttribute : "!23123",
                    gender : "ased",
                    facebookID: profile.id
                });
                  newUser.save((user) => {
                    return done(null, user); // 새로운 회원 생성 후 로그인
                });
                */
            }
    ));
};