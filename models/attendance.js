const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  day : {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  employees: [
    {
      empId : {type: Schema.Types.ObjectId, ref: 'Employee'},
      empName : {type: String},
      present : {type: Number, default : 0},
      hour : {type: String},
      min : {type: String} 
    }
  ],
  hr : {
    type: Schema.Types.ObjectId,
    ref: 'HrManager'
  }
});


module.exports = mongoose.model('Attendance', attendanceSchema);


