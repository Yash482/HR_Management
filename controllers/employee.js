const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const io = require('../socket');
const Employee = require('../models/employee');
const Hr = require('../models/hr');
const Leave = require('../models/leaveReq');
const Loan = require('../models/loanReq');
const Attendance = require('../models/attendance');


exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedEmployee;
  try {
    const employee = await Employee.findOne({ email: email });
    if (!employee) {
      const error = new Error('wrong email id');
      error.statusCode = 401;
      throw error;
    }
    loadedEmployee = employee;
    const isEqual = await bcrypt.compare(password, employee.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedEmployee.email,
        employeeId: loadedEmployee._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, employee: loadedEmployee });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.createLeaveReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const today = new Date();
  const month = today.getUTCMonth()+1;
  const day = today.getUTCDate();
  const year = today.getUTCFullYear();

  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const status = 0;
  const reason = req.body.reason;
  const currDate = day + "/" + month + "/" + year;
  const employee = req.params.empId;
  let hr;
  
  try {
    const currEmployee = await Employee.findById(req.params.empId);
    hr = currEmployee.hr;
    const leaveReq = new Leave({
      startDate: startDate,
      endDate: endDate,
      status: status,
      employee: employee,
      currDate : currDate,
      reason : reason,
      hr : hr
    });
    await leaveReq.save();
    // io.getIO().emit('posts', {
    //   action: 'create',
    //   post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    // });
      res.status(201).json({
      message: 'Leave request created successfully!',
      status: status
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.createLoanReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  // if (!req.file) {
  //   const error = new Error('No image provided.');
  //   error.statusCode = 422;
  //   throw error;
  // }
  //const imageUrl = req.file.path;
  const today = new Date();
  const month = today.getUTCMonth()+1;
  const day = today.getUTCDate();
  const year = today.getUTCFullYear();

  const currDate = day + "/" + month + "/" + year;
  const amount = req.body.amount;
  const status = 0;
  const employee = req.params.empId;
  let isLoan = req.body.isLoan ? true : false;
  let hr;
  
  try {
    const currEmployee = await Employee.findById(req.params.empId);
    hr = currEmployee.hr;
    const loanReq = new Loan({
      status: status,
      amount : amount,
      employee: employee,
      isLoan: isLoan,
      currDate : currDate,
      hr : hr
    });
    await loanReq.save();
    // io.getIO().emit('posts', {
    //   action: 'create',
    //   post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    // });
      res.status(201).json({
      message: 'Loan request is made!',
      status: status
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.markAttendance = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.empId);

    if (!employee) {
      const error = new Error('Could not find employee.');
      error.statusCode = 404;
      throw error;
    }
    const hrId = employee.hr ;
    const today = new Date();
    const month = today.getUTCMonth()+1;
    const day = today.getUTCDate();
    const year = today.getUTCFullYear();
    //console.log(day);console.log(month);console.log(year);console.log(hrId);

    const todayAttendance = await Attendance.findOne({day : day, month: month, year: year, hr: hrId});
    //console.log(todayAttendance.employees);
     let hrEmployees = [...todayAttendance.employees];
     
    hrEmployees.forEach(employee => {
      if(employee.empId == req.params.empId){
        const todayDate = new Date();
        const hour = todayDate.getHours();
        const min = todayDate.getMinutes();
        employee.present = 1;
        employee.hour = hour;
        employee.min = min;
      }
    });
    todayAttendance.employees = hrEmployees;
    await todayAttendance.save();

    res.status(200).json({ message: 'Attendance marked.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

