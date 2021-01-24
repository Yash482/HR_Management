const express = require('express');
const { body } = require('express-validator/check');

const Employee = require('../models/employee');
const hrController = require('../controllers/hr');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/:hrId/add-employee',  hrController.postAddEmployee);

router.post('/login', hrController.login);

//<<<<<<< master
router.get('/:hrId/leave-reqs',  hrController.getLeaveReq);
router.post('/:hrId/search',  hrController.searchAll);
router.get('/:hrId/loan-reqs/:loan',  hrController.getLoanReq);
router.get('/:hrId/bonus-reqs/:loan',  hrController.getLoanReq);
//=======
router.get('/:hrId/leave-reqs',isAuth,  hrController.getLeaveReq);
router.get('/:hrId/loan-reqs',isAuth,  hrController.getLoanReq);
router.get('/:hrId/bonus-reqs',isAuth,  hrController.getLoanReq);
//>>>>>>> master

router.get('/:hrId/employees',isAuth,   hrController.getEmployees);
router.get('/:hrId/employees/:empId',isAuth,   hrController.getEmployee);
router.put('/:hrId/employees/:empId/edit',isAuth,   hrController.updateEmployeeDetails);
router.post('/:hrId/employees/:empId/add-allowance',isAuth,   hrController.addAllowance);
router.post('/:hrId/employees/:empId/add-deduction',isAuth,   hrController.addDeduction);
router.post('/:hrId/employees/:empId/remove-allowance/:allowanceId',isAuth,   hrController.removeAllowance);
router.post('/:hrId/employees/:empId/remove-deduction/:deductId',isAuth,   hrController.removeDeduction);


router.post('/:hrId/leave-reqs/:leaveId/:status',isAuth,  hrController.postLeaveReqStatus);
router.post('/:hrId/loan-reqs/:loanId/:status',isAuth,   hrController.postLoanReqStatus);
router.post('/:hrId/bonus-reqs/:bonusId/:status',isAuth,   hrController.postLoanReqStatus);

router.post('/:hrId/open-attendance',isAuth,   hrController.markAbsent);
router.get('/:hrId/employees/:empId/get-attendance',isAuth,   hrController.getAttendance);
router.get('/:hrId/get-specific-attendance',isAuth,   hrController.getSpecificAttendance);


module.exports = router;
