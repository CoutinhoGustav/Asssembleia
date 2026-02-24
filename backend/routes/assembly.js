const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const SystemStatus = require('../models/SystemStatus');

// Get all students
router.get('/students', auth, async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Register student
router.post('/students', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const newStudent = new Student({
            name,
            registeredBy: req.admin.name
        });
        await newStudent.save();
        res.json(newStudent);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

const Report = require('../models/Report');

// Post attendance (Bulk or single)
router.post('/attendance', auth, async (req, res) => {
    const { records } = req.body; // Array of { studentName, status }
    try {
        // 1. Save individual records
        const savedRecords = await Attendance.insertMany(
            records.map(r => ({
                ...r,
                recordedBy: req.admin.name,
                date: new Date()
            }))
        );

        // 2. Create a summary Report for easy visualization in MongoDB
        const presentStudents = records.filter(r => r.status === 'present').map(r => r.studentName);
        const absentStudents = records.filter(r => r.status === 'absent').map(r => r.studentName);

        const newReport = new Report({
            date: new Date(),
            presentStudents,
            absentStudents,
            totalPresent: presentStudents.length,
            totalAbsent: absentStudents.length,
            recordedBy: req.admin.name
        });
        await newReport.save();

        res.json({ savedRecords, report: newReport });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get context (System Status)
router.get('/status', async (req, res) => {
    try {
        let status = await SystemStatus.findOne({ id: 'main' });
        if (!status) {
            status = new SystemStatus({ id: 'main', isCallActive: false });
            await status.save();
        }
        res.json(status);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Toggle system (Liga/Desliga)
router.post('/status/toggle', auth, async (req, res) => {
    try {
        let status = await SystemStatus.findOne({ id: 'main' });
        status.isCallActive = !status.isCallActive;
        await status.save();
        res.json(status);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get History (History with filters)
router.get('/history', auth, async (req, res) => {
    const { date } = req.query;
    let query = {};
    if (date) {
        const [year, month, day] = date.split('-').map(Number);
        const start = new Date(year, month - 1, day, 0, 0, 0, 0);
        const end = new Date(year, month - 1, day, 23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
    }
    try {
        const history = await Attendance.find(query).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update attendance record status
router.put('/attendance/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const record = await Attendance.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after' }
        );
        res.json(record);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete student
router.delete('/students/:id', auth, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Membro removido com sucesso' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete attendance record
router.delete('/attendance/:id', auth, async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Registro removido com sucesso' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
