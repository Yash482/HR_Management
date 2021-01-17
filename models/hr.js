const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hrSchema = new Schema({
  name : {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    }
  ]
});

hrSchema.methods.addEmployee = function(empId) {
  
  const updatedEmployees = [...this.employees];
    updatedEmployees.push(empId);
  
  this.employees = updatedEmployees;
  return this.save();
};


module.exports = mongoose.model('HrManager', hrSchema);
