const { Router } = require('express');
const employeeCtl = require('../controllers/employees.controller.js')
const router = Router();
const verification = require('./../config')

router.get('/', verification, employeeCtl.getEmployees);

router.post('/', verification, employeeCtl.createEmployee);

router.get('/:id', verification, employeeCtl.getEmployee);

router.put('/:id', verification, employeeCtl.editEmployee);

router.delete('/:id', verification, employeeCtl.deleteEmployee);

module.exports = router;
