const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true }, (err) => {
    if(!err){
        console.log('MongoDB connection succeeded');
    }else{
        console.log('Error occured: ' + JSON.stringify(err, undefined, 2));
    }
});

require('./user.model');