const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Employee = require('../models/employee');
const Hr = require('../models/hr');
const Leave = require('../models/leaveReq');
const Loan = require('../models/loanReq');
const Attendance = require('../models/attendance');


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
  const salary = req.body.salary;
  const role = req.body.role;
  const team = req.body.team;
  const yearsWorked = 0;
  const hrId = req.params.hrId;

  try {
    
    const hashedPw = await bcrypt.hash(password, 12);

    const employee = new Employee({
      email: email,
      password: hashedPw,
      name: name,
      salary : salary,
      role: role,
      team : team,
      yearsWorked : yearsWorked,
      hr : hrId
    });
    console.log(employee);
    const currHr = await Hr.findById(hrId)
    currHr.addEmployee(employee._id);
    const result = await employee.save();
    console.log("employee saved")
    res.status(201).json({ message: 'Employee added!', EmployeeId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addAllowance = async (req, res, next) => {
  const title = req.body.title;
  const time = req.body.time;
  const amount= req.body.amount;
  try {
    const emp = await Employee.findById(req.params.empId);
    await emp.addAllowance({title : title,time: time,amount:amount})
    res.status(201).json({ message: 'allowance added!', allowances : emp.allowances});

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.removeAllowance = async (req, res, next) => {
  const allowanceId = req.params.allowanceId;
  try {
    const emp = await Employee.findById(req.params.empId);
    await emp.removeAllowance(allowanceId);
    res.status(201).json({ message: 'allowance removed!', allowances : emp.allowances});

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.addDeduction = async (req, res, next) => {
  const title = req.body.title;
  const time = req.body.time;
  const amount= req.body.amount;
  try {
    const emp = await Employee.findById(req.params.empId);
    await emp.addDeduction({title : title, time: time,amount:amount})
    res.status(201).json({ message: 'deduction added!', deductions : emp.deduction});

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.removeDeduction = async (req, res, next) => {
  const deductId = req.params.deductId;
  try {
    const emp = await Employee.findById(req.params.empId);
    await emp.removeDeduction(deductId);
    res.status(201).json({ message: 'deduction removed!', deduction : emp.deduction});

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.login = async (req, res, next) => {
  console.log( req.body);
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email);
  let loadedHr;
  try {
    const hr = await Hr.findOne({ email: email });
    console.log(hr);
    if (!hr) {
      const error = new Error('wrong email id');
      error.statusCode = 401;
      throw error;
    }
    loadedHr = hr;
    const isEqual = password== hr.password;
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedHr.email,
        hrId: loadedHr._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, hr: loadedHr });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.markAbsent = async (req, res, next) => {
    
    const today = new Date();
    const month = today.getUTCMonth()+1;
    const day = today.getUTCDate();
    const year = today.getUTCFullYear();

    try {
      const Hremployees = await Employee.find({hr : req.params.hrId});
      const updatedEmployees = Hremployees.map(employee => {
        let empOb = {
              empId : employee._id,
              empName : employee.name,
              present : 0,
              hour : -1,
              min : -1,
            }
        return empOb;
      })


      const todayAttendance = new Attendance({
        day: day,
        month: month,
        year: year,
        employees : updatedEmployees,
        hr: req.params.hrId
      });
      const result = await todayAttendance.save();
      res.status(201).json({ message: 'Attendance form open'});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
}

exports.getSpecificAttendance = async (req, res, next) => {
  console.log(req.body)
  try {
    const attendance = await Attendance.findOne({day : req.params.day, month : req.params.month, year : req.params.year, hr: req.params.hrId});

    res.status(201).json({ message: 'Attendance for given day', attendance : attendance.employees});

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getAttendance = async (req, res, next) => {
  try {
    
    const AttendanceArr = await Attendance.find({hr : req.params.hrId, year: req.body.year, month : req.body.month});
    //console.log(AttendanceArr);

    let employeeAttendance = AttendanceArr.map(empAtt => {
        let present, hour, min;
        empAtt.employees.forEach(emp => {
          //console.log(emp);
            if(emp.empId == req.params.empId){
                present = emp.present; hour= emp.hour; min = emp.min; 
            }
        });
        return {day : empAtt.day, present : present, hour: hour, min : min}
    })
    
    res.status(201).json({message:"month employee",attendance : employeeAttendance});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.getLeaveReq = async (req, res, next) => {

  try {
    const leaveReq = await Leave.find({status : 0, hr: req.params.hrId})
      .populate('employee')
      

    res.status(200).json({
      message: 'Fetched leave req successfully.',
      leaves: leaveReq
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.getLoanReq = async (req, res, next) => {
 
    try {
///<<<<<<< master
      //const totalItems = await Post.find().countDocuments();
      const isLoan = req.params.loan ==='1'? true : false;
      const loanReq = await Loan.find({status : 0, hr: req.params.hrId, isLoan : isLoan})
        .populate('employee')
      
  
      res.status(200).json({
        message: 'Fetched  req successfully.',
        loans: loanReq
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  

exports.getEmployees = async (req, res, next) => {
 
    try {
      const employees = await Employee.find({ hr: req.params.hrId})
    
      res.status(200).json({
        message: 'Fetched employees successfully.',
        employees: employees
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  
exports.getEmployee = async (req, res, next) => {
    try {
      const employee = await Employee.findById(req.params.empId)
  
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
      res.status(200).json({ message: 'Request updated.' , leave : leave});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
      
  };

  exports.postLoanReqStatus = async (req, res, next) => {
    try {
      let loanId = req.params.loanId ? req.params.loanId : req.params.bonusId;
      const loan = await Loan.findById(loanId);
      if (!loan) {
        const error = new Error('Request not found.');
        error.statusCode = 404;
        throw error;
      }
      loan.status = req.params.status;
  
      await loan.save();
      res.status(200).json({ message: 'Request updated.', loan : loan });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
      
  };

exports.updateEmployeeDetails = async (req, res, next) => {
  const newSalary = req.body.salary; 
  const newTeam = req.body.team; 

  try {
    const employee = await Employee.findById(req.params.empId);
    if (!employee) {
      const error = new Error('Employee not found.');
      error.statusCode = 404;
      throw error;
    }
    employee.salary = newSalary;
    employee.team = newTeam;

    await employee.save();
    res.status(200).json({ message: 'employee updated.' , employee : employee});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.searchAll = async ( req ,res,next) =>{
    
  const data = req.body.data;
  console.log( data);

  try {
    //const totalItems = await Post.find().countDocuments();
  const employees = await Employee.find( data ) 
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


}




