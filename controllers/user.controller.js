const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    console.log(req.body.username);
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Username exists!']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) =>{
    passport.authenticate('local', (err, user, info) => {
        if(err)
            return res.status(400).json(err);
        else if(user)
            return res.status(200).json({"token": user.generateJwt()});
        else
            return res.status(404).json(info);
    })(req, res);
}

module.exports.changePw = (req, res) =>{
    User.findOne({ _id: req._id }, (err, user) => {
        if(user.verifyPassword(req.body.oldpw)){
            if(req.body.newpw === req.body.repnewpw){
                user.changePassword(req.body.newpw);
                return res.status(200).json({ status: true, message: 'Password changed!'});
            } else {
                return res.status(404).json({ status: false, message: 'Passwords are not equal!'});
            }
        }else{
            return res.status(404).json({ status: false, message: 'Old password is incorrect!'});
        }
    });
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['username']), message: 'User was found!' });
        }
    );
}

module.exports.getAllUser = (req, res, next) =>{
    User.find({}, function(err, users) {
        res.json(users);  
    });
}

module.exports.setUser = (req, res, next) =>{
    User.updateOne({ _id: req.body.userid }, { $set: {username: req.body.username}}, (err, user) => {
        if(err){
            return res.status(404).json({ status: false, message: 'User ID was not found'});
        }
        else {
            return res.status(200).json({ status: true, message: 'Username changed!'});
        }

    })
}