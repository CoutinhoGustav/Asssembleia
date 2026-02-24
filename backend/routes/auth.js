const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let admin = await Admin.findOne({ email });
        if (admin) return res.status(400).json({ msg: 'Admin already exists' });

        admin = new Admin({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
        await admin.save();

        const payload = { admin: { id: admin.id, name: admin.name } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, admin: { name: admin.name, email: admin.email } });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { admin: { id: admin.id, name: admin.name } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, admin: { name: admin.name, email: admin.email } });
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

const auth = require('../middleware/auth');

// Get current admin
router.get('/me', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    const { name, email, avatar } = req.body;
    try {
        let admin = await Admin.findById(req.admin.id);
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (avatar !== undefined) admin.avatar = avatar;

        await admin.save();
        res.json({ name: admin.name, email: admin.email, avatar: admin.avatar });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update password
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const admin = await Admin.findById(req.admin.id);
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ msg: 'Senha atual incorreta' });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();
        res.json({ msg: 'Senha atualizada com sucesso' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.admin.id);
        res.json({ msg: 'Conta excluída com sucesso' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
