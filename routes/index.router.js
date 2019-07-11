const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userprofile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/chgpw', jwtHelper.verifyJwtToken, ctrlUser.changePw);
router.get('/getall', ctrlUser.getAllUser);
router.post('/setname', jwtHelper.verifyJwtToken, ctrlUser.setUser);

module.exports = router;