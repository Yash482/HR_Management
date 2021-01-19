const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  currDate : {
    type: String,
    required: true
  },
  amount : {
    type: Number,
    required: true
  },
  status : {
    type: Number,
    required: true
  },
  isLoan : {
    type : Boolean,
    required : true
  },
  hr:
    {
      type: Schema.Types.ObjectId,
      ref: 'HrManager',
      required: true
    },
  employee:
    {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    }
});

module.exports = mongoose.model('LoanReq', loanSchema);
