const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  currDate : {
    type: Date,
    required: true
  },
  startDate : {
    type: Date,
    required: true
  },
  endDate : {
    type: Date,
    required: true
  },
  status : {
    type: Number,
    required: true
  },
  hr:
    {
      type: Schema.Types.ObjectId,
      ref: 'HrManager',
      required : true
    },
  employee:
    {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    }
});

module.exports = mongoose.model('LeaveReq', leaveSchema);
