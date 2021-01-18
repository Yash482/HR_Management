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
        title : {type: String},
        time : {type: String}
      }
    ],
    deduction : [
      {
        title : {type: String},
        time : {type: String}
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

module.exports = mongoose.model('Employee', employeeSchema);
