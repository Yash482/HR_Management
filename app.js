const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const employeeRoutes = require('./routes/employee');
const hrRoutes = require('./routes/hr');
const { request } = require('http');
const Hr = require('./models/hr');



mongoose.connect("mongodb://localhost/hr-db", {useNewUrlParser: true, useUnifiedTopology: true});


const app = express();


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// const hr = new Hr({
//   name : "Ayushi Singh",
//   email: "ayushinasha@gmail.com",
//   password: "12345678"
// })

//  hr.save();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/employee', employeeRoutes);
app.use('/hr', hrRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


app.listen(5000, ()=> {
  console.log("server started")
})
