const express = require('express');
const { body } = require('express-validator/check');

const employeeController = require('../controllers/employee');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.post('/login', employeeController.login);

router.post('/:empId/create-leave-req', employeeController.createLeaveReq);
router.post('/:empId/create-loan-req', employeeController.createLoanReq);
router.post('/:empId/create-bonus-req', employeeController.createLoanReq);

router.get('/:empId/leave-reqs', employeeController.getLeaveReq);
router.get('/:empId/loan-reqs', employeeController.getLoanReq);
router.get('/:empId/bonus-reqs', employeeController.getLoanReq);


router.post('/:empId/mark-attendance', employeeController.markAttendance);


module.exports = router;
