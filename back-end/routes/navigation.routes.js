const { Router } = require('express');
const navigationCtl = require('../controllers/navigation.controller.js')
const router = Router();
const verification = require('../config.js')

router.get('/GetAllNavigationRoutes', verification, navigationCtl.getAllNavigations);

router.post('/registerNavigation', verification, navigationCtl.createNavigation);

router.get('/:id', verification, navigationCtl.getNavigation);

router.post('/editNavigation', verification, navigationCtl.editNavigation);

router.post('/deleteNavigation', verification, navigationCtl.deleteNavigation);

module.exports = router;
