const express = require('express');
const { body } = require('express-validator/check');

const employeeController = require('../controllers/employee');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.post('/login', employeeController.login);

router.post('/:empId/create-leave-req', employeeController.createLeaveReq);
router.post('/:empId/create-loan-req', employeeController.createLoanReq);
router.post('/:empId/create-bonus-req', employeeController.createLoanReq);


// router.put(
//   '/post/:postId',
//   isAuth,
//   [
//     body('title')
//       .trim()
//       .isLength({ min: 5 }),
//     body('content')
//       .trim()
//       .isLength({ min: 5 })
//   ],
//   feedController.updatePost
// );

// router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
