const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    registeredBy: { type: String }, // Admin name or ID
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', studentSchema);
