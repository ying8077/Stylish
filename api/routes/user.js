const express = require('express');
const router = express.Router();
const db = require('../db');
const db2 = require('../models');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

const User = db2.User;
router.use(passport.initialize());
router.use(passport.session());

router.post('/', async (req, res) => {
    const user = {
        user_name: req.body.userName,
        email: req.body.email,
        password: req.body.password
    };
    const schema = joi.object({
        user_name: joi.string().required(),
        email: joi.string().email().trim().required(),
        password: joi.string().regex(/[a-zA-Z0-9]{6,30}$/).required()
    });
    const { error, value } = schema.validate(user);
    if (error !== undefined) {
        return res.send({ status: "error", message: "資料不符合格式" });
    }

    let check = await db.execute("SELECT EXISTS(SELECT * FROM `Users` WHERE `email` = ?)", [user.email + ""]);
    let check_type = Number(Object.values(check[0][0]));
    if (check_type === 1) {
        return res.send({ status: "error", message: "信箱已被註冊" });
    } else if (check_type === 0) {
        let paras = [
            user.user_name + "",
            user.email + "",
            bcrypt.hashSync(user.password, 10) + ""
        ]
        db.execute("INSERT INTO `Users`(`name`, `email`, `password`) VALUES (?, ?, ?)", paras)
            .then(() => {
                return res.json({ status: "success", message: "註冊成功" })
            })
            .catch(err => {
                res.status(400).send(err);
            })
    }
});

router.post('/login', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    let check = await db.execute("SELECT * FROM `Users` WHERE `email` = ?", [user.email + ""]);
    let result = check[0];
    if (Object.keys(result).length === 0) {
        return res.status(400).send({ status: "error", message: "信箱尚未註冊" });
    }
    
    if(user.password === ''){
        return res.status(400).send({ status: "error", message: "請輸入密碼" });
    }
   
    let isMatch = await bcrypt.compare(user.password, result[0].password);
    if (isMatch) {
        const payload = {
            user_id: result[0].id,
            user_name: result[0].name,
            email: result[0].email
        };
        const token = jwt.sign(payload, process.env.JWT_KEY);
        res.send({ status: "success", message: '登入成功', token })
    } else {
        return res.status(400).send({ status: "error", message: "密碼錯誤" });
    }
});

router.get('/profile', (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            return res.send({ status:"error", message: "請登入" })
        } else {
            res.send(payload);
        }
    })
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "https://stylish-yjing.tk/api/users/auth/facebook/stylish"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            where: { facebook_id: profile.id }
        }).then(result => {
            cb(null, result[0]);
        });
    }
));

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/facebook/stylish',
    passport.authenticate('facebook', { failureRedirect: '/signIn' }),
    function (req, res) {
        res.redirect('/');
    });

module.exports = router;
