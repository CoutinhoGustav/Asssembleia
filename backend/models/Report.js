const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    presentStudents: [{ type: String }],
    absentStudents: [{ type: String }],
    totalPresent: { type: Number },
    totalAbsent: { type: Number },
    recordedBy: { type: String },
    assemblyName: { type: String, default: "Chamada Geral" }
});

module.exports = mongoose.model('Report', reportSchema);
