const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
    date: { type: Date, default: Date.now },
    recordedBy: { type: String, required: true },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
