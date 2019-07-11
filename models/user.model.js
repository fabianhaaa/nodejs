const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Username can\'t be Empty!',
        unique: true
    },
    password: {
        type: String,
        required: 'Username can\'t be Empty!',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    saltSecret: String,
    right: Number
});

userSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) =>{
            this.password = hash;
            this.saltSecret = salt;
            this.right = 0;
            next();
        })
    })
})

userSchema.methods.verifyPassword = function (password){
    console.log(this.password);
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.changePassword = function(password){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) =>{
            this.password = hash;
        })
    })
}

userSchema.methods.changeUsername = function(username){
    console.log(username);
    this.username = username;
    return true;
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({
        _id: this._id,
        right: this.right
    }, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        });
}

mongoose.model('User', userSchema);