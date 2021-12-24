const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const User = require('../models/user');

const router = express.Router();

// router.post('/join', isNotLoggedIn, async function (req, res, next) => {
//     const 
// })