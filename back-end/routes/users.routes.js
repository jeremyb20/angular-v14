const { Router } = require('express');
const userCtl = require('../controllers/users.controller.js')
const router = Router();
const verification = require('./../config')

router.get('/getUsers', verification, userCtl.getUsers);

router.get('/getEmployees', verification, userCtl.getEmployees);

router.post('/registerUser',userCtl.registerUser);

router.post('/login',userCtl.loginUser);

router.get('/:id',userCtl.getUserById);

router.post('/editUser',userCtl.editUser);

router.post('/setTranslateUser',verification,userCtl.setTranslateUser);

router.post('/setThemeUser',verification,userCtl.editTheme);

router.post('/deleteUser',userCtl.deleteUser);

module.exports = router;
