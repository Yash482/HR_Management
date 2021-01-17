const express = require('express');
const { body } = require('express-validator/check');

const Employee = require('../models/employee');
const hrController = require('../controllers/hr');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/:hrId/add-employee',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return Employee.findOne({ email: value }).then(Employee => {
          if (Employee) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Minimum length should be 5.')
  ],
  hrController.postAddEmployee
);

router.post('/login', hrController.login);

router.get('/:hrId/leave-reqs', isAuth, hrController.getLeaveReq);
router.get('/:hrId/loan-reqs', isAuth, hrController.getLoanReq);
router.get('/:hrId/bonus-reqs', isAuth, hrController.getLoanReq);

router.get('/:hrId/employees', isAuth, hrController.getEmployees);
router.get('/:hrId/employees/:empId', isAuth, hrController.getEmployee);


// router.get('/status', isAuth, hrController.getUserStatus);

// router.patch(
//   '/status',
//   isAuth,
//   [ 
//     body('status')
//       .trim()
//       .not()
//       .isEmpty()
//   ],
//   hrController.updateUserStatus
// );

module.exports = router;
