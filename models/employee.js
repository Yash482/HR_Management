const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    name: {
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
    yearsWorked: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    team: {
      type: String,
      required: true
    },
    salary: {
      type: String,
      required: true
    },
    allowances : [
      {
        title : String,
        time : String
      }
    ],
    deduction : [
      {
        title : String,
        time : String
      }
    ],
    hr: {
      type: Schema.Types.ObjectId,
      ref: 'HrManager',
      required: true
    }
  },
  { timestamps: true }
);


employeeSchema.methods.addAllowance = function(allowance) {
  
  const updatedAllowances = [...this.allowances];

    updatedAllowances.push(allowance);
 
  this.allowances = updatedAllowances;
  return this.save();
};

employeeSchema.methods.addDeduction = function(deduction) {
  
  const updatedDeduction = [...this.deduction];

    updatedDeduction.push(deduction);
 
  this.deduction = updatedDeduction;
  return this.save();
};



module.exports = mongoose.model('Employee', employeeSchema);
