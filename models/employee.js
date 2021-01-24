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
    securutyQuestion: {
      type: String
    },
    securityAnswer: {
      type: String
    },
    allowances : [
      {
        title : String,
        time : String,
        amount : String
      }
    ],
    deduction : [
      {
        title : String,
        time : String,
        amount:String
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

employeeSchema.methods.removeAllowance = function(allowanceId) {
  
  const Allowances = [...this.allowances];

  let i=0;

  Allowances.forEach(allowance => {
      if(allowance._id == allowanceId){
        return;
      }
      i++;
  })
  Allowances.splice(i, 1);

 //console.log("allowance removed");
 //console.log(Allowances)
  this.allowances = [...Allowances];
  return this.save();
};

employeeSchema.methods.addDeduction = function(deduction) {
  
  const updatedDeduction = [...this.deduction];

    updatedDeduction.push(deduction);
 
  this.deduction = updatedDeduction;
  return this.save();
};

employeeSchema.methods.removeDeduction = function(deductId) {
  
  const Deductions = [...this.deduction];

  let i=0;

  Deductions.forEach(deduction => {
      if(deduction._id == deductId){
        return;
      }
      i++;
  })
  Deductions.splice(i, 1);

    
 
  this.deduction = Deductions;
  return this.save();
};



module.exports = mongoose.model('Employee', employeeSchema);
