const passport = require('passport');
const AppleStrategy = require('passport-apple').Strategy;
const bcrypt = require('bcrypt');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
module.exports = () =>{
    console.log('in apple check ');

    passport.use(new AppleStrategy({
        clientID : "co.mindground.service",
        teamID : config.oauth.apple.teamid,
        callbackURL : config.oauth.apple.callbackurl,
        keyID : config.oauth.apple.keyid,
        privateKeyLocation : config.oauth.apple.privatekeylocation
    }, async (req, accessToken, refreshToken, decodedIdToken, profile, cb) => {
            let jwtDecodeToken = jwt.decode(decodedIdToken);
            console.log('jwtDecodeToken' + JSON.stringify(jwtDecodeToken));

            // poyload의 sub가 apple의 고유 ID
            let getAppleId = jwtDecodeToken.sub;

            console.log('jwtDecodeToken id ===== ' + getAppleId);

            let user = await User.findOne( {where : { appleID : getAppleId}, raw:true,nest : true,} );
            console.log(JSON.stringify(jwtDecodeToken)+'  ###########get apple id');

            if(user){
                return cb(null, user);
            }

            if(req.isAuthenticated())
            {
                // 로그인한 User의 소셜 가입
                await User.update(
                    { appleID : getAppleId },
                    { where : { userUID : req.session.passport.user.userUID } })
                .then( (result) => {
                    req.user.appleID = getAppleId;
                    user = req.user;
                    return cb(null, user);
                })
                .catch( (error) => {
                    return cb(null, false)
                });
            }
            else
            {
                // 로그인 하지 않은 User 및 소셜 가입 이력이 없는 User
                req.session.socialSignUpFlag = 'appleSignUp';
                req.session.socialId = getAppleId;
                req.session.save();
                
                return cb(null, false);
            }
        
            /*
            const newUser = new User({ // 없으면 회원 생성
                userEmail : 'testemail2@testemail.com',
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
