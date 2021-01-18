const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Employee = require('../models/employee');
const Hr = require('../models/hr');
const Leave = require('../models/leaveReq');
const Loan = require('../models/loanReq');


exports.postAddEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const salary = req.body.email;
  const role = req.body.role;
  const team = req.body.team;
  const yearsWorked = 0;
  const hrId = req.params.id;
  const allowances = req.body.allowances;
  const deduction = req.body.deduction;

  
  
  try {
    await Hr.addEmployee(hrId); 
    
    const hashedPw = await bcrypt.hash(password, 12);

    const employee = new Employee({
      email: email,
      password: hashedPw,
      name: name,
      salary : salary,
      role: role,
      team : team,
      yearsWorked : yearsWorked,
      hr : hrId,
      allowances : allowances,
      deduction : deduction
    });
    const result = await employee.save();
    res.status(201).json({ message: 'Employee added!', EmployeeId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedHr;
  try {
    const hr = await Hr.findOne({ email: email });
    if (!hr) {
      const error = new Error('wrong email id');
      error.statusCode = 401;
      throw error;
    }
    loadedHr = hr;
    const isEqual = await bcrypt.compare(password, hr.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedHr.email,
        hrId: loadedUser._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, hrId: loadedHr._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getLeaveReq = async (req, res, next) => {
//  const currentPage = req.query.page || 1;
 // const perPage = 2;
  try {
    //const totalItems = await Post.find().countDocuments();
    const leaveReq = await Leave.find({status : 0, hr: req.params.hrId})
      .populate('employee')
      //.sort({ Date: -1 })
      // .skip((currentPage - 1) * perPage)
      // .limit(perPage);

    res.status(200).json({
      message: 'Fetched leave req successfully.',
      leaves: leaveReq
    //  totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getLoanReq = async (req, res, next) => {
  //  const currentPage = req.query.page || 1;
   // const perPage = 2;
    try {
      //const totalItems = await Post.find().countDocuments();
      const isLoan = req.body.isLoan ? true : false;
      const loanReq = await Loan.find({status : 0, hr: req.params.hrId, isLoan : isLoan})
        .populate('employee')
        //.sort({ createdAt: -1 })
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);
  
      res.status(200).json({
        message: 'Fetched  req successfully.',
        loans: loanReq
      //  totalItems: totalItems
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  

exports.getEmployees = async (req, res, next) => {
  //  const currentPage = req.query.page || 1;
   // const perPage = 2;
    try {
      //const totalItems = await Post.find().countDocuments();
      const employees = await Employee.find({ hr: req.params.hrId})
        //.populate('employee')
        // .sort({ createdAt: -1 })
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);
  
      res.status(200).json({
        message: 'Fetched employees successfully.',
        employees: employees
      //  totalItems: totalItems
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  
exports.getEmployee = async (req, res, next) => {
  //  const currentPage = req.query.page || 1;
   // const perPage = 2;
    try {
      //const totalItems = await Post.find().countDocuments();
      const employee = await Employee.findById(req.params.empId)
        //.populate('employee')
        // .sort({ createdAt: -1 })
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);
  
      res.status(200).json({
        message: 'Fetched employees successfully.',
        employee: employee
      //  totalItems: totalItems
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  
  exports.postLeaveReqStatus = async (req, res, next) => {
    try {
      const leave = await Leave.findById(req.params.leaveId);
      if (!leave) {
        const error = new Error('Request not found.');
        error.statusCode = 404;
        throw error;
      }
      leave.status = req.params.status;
  
      await leave.save();
      res.status(200).json({ message: 'Request updated.' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
      
  };

  exports.postLoanReqStatus = async (req, res, next) => {
    try {
      const loan = await Loan.findById(req.params.loanId);
      if (!loan) {
        const error = new Error('Request not found.');
        error.statusCode = 404;
        throw error;
      }
      loan.status = req.params.status;
  
      await loan.save();
      res.status(200).json({ message: 'Request updated.' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
      
  };
    
  

// exports.getUserStatus = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       const error = new Error('User not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ status: user.status });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

exports.updateEmployeeDetails = async (req, res, next) => {
  const newSalary = req.body.salary; 
  const newTeam = req.body.team; 
  const newAllowances = req.body.allowances; 
  const newDeduction = req.body.deduction; 

  try {
    const employee = await Employee.findById(req.params.empId);
    if (!employee) {
      const error = new Error('Employee not found.');
      error.statusCode = 404;
      throw error;
    }
    employee.salary = newSalary;
    employee.team = newTeam;
    employee.allowances = newAllowances;
    employee.deduction = newDeduction;

    await employee.save();
    res.status(200).json({ message: 'employee updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

