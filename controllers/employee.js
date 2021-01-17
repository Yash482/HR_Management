const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const io = require('../socket');
const Employee = require('../models/employee');
const Hr = require('../models/hr');
const Leave = require('../models/leaveReq')
const Loan = require('../models/loanReq')


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
    res.status(200).json({ token: token, employeeId: loadedEmployee._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// exports.getPosts = async (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = 2;
//   try {
//     const totalItems = await Post.find().countDocuments();
//     const posts = await Post.find()
//       .populate('creator')
//       .sort({ createdAt: -1 })
//       .skip((currentPage - 1) * perPage)
//       .limit(perPage);

//     res.status(200).json({
//       message: 'Fetched posts successfully.',
//       posts: posts,
//       totalItems: totalItems
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

exports.createLeaveReq = async (req, res, next) => {
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
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const status = 0;
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
  const amount = req.body.amount;
  const status = 0;
  const employee = req.params.empId;
  isLoan : req.body.loan ? true : false;
  let hr;
  
  try {
    const currEmployee = await Employee.findById(req.params.empId);
    hr = currEmployee.hr;
    const loanReq = new Loan({
      status: status,
      amount : amount,
      employee: employee,
      isLoan: isLoan,
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


exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
