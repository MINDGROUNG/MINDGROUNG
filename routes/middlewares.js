const ClassObject = require('../mongoModels/ClassObject');
const ObjectBookmarks = require('../mongoModels/ObjectBookmarks');
const GatheringObject = require('../mongoModels/GatheringObject');
const JournalObject = require('../mongoModels/JournalObject');
const ShareObject = require('../mongoModels/ShareObject');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.isLoggedIn = (req, res, next)=>{
     if (req.isAuthenticated()){
         next();
         console.log('check is auth');
     }else{
         console.log('not loginned');
         res.redirect('/');
     }
};

exports.isNotLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        console.log('not loggedin')
        next();
    }else{
        console.log('come check')
        // res.render('web/view/index.html', { req: req });
        
        res.redirect('/afterLogin');
    }
}