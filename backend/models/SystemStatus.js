const mongoose = require('mongoose');

const systemStatusSchema = new mongoose.Schema({
    id: { type: String, default: 'main' },
    isCallActive: { type: Boolean, default: false },
});

module.exports = mongoose.model('SystemStatus', systemStatusSchema);
