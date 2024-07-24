const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { token, password } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const { email } = decoded;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role: 'client' });
    res.json({ message: 'User registered', user });
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

router.post('/invite', auth, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { email } = req.body;
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log(`Invite token: ${token}`);
  res.json({ message: 'Invite token generated', token });
});

module.exports = router;
