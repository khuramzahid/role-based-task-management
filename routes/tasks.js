const express = require('express');
const { Task, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
	const { title, description, status } = req.body;
	const task = await Task.create({ title, description, status, userId: req.userId });
	res.json({ message: 'Task created', task });
});

router.get('/', async (req, res) => {
	const { page = 1, limit = 10, status, userId } = req.query;
	const offset = (page - 1) * limit;

	let where = {};
	if (status) where.status = status;
	if (userId && req.userRole === 'admin') where.userId = userId;
	if (req.userRole !== 'admin') where.userId = req.userId;

	const tasks = await Task.findAndCountAll({ where, limit, offset });
	res.json({ tasks, totalPages: Math.ceil(tasks.count / limit) });
});

router.get('/cursor', async (req, res) => {
	const { cursor, limit = 10, status, userId } = req.query;
	let where = {};
	if (status) where.status = status;
	if (userId && req.userRole === 'admin') where.userId = userId;
	if (req.userRole !== 'admin') where.userId = req.userId;
	if (cursor) where.id = { [Op.gt]: cursor };

	const tasks = await Task.findAll({ where, limit, order: [['id', 'ASC']] });
	const nextCursor = tasks.length ? tasks[tasks.length - 1].id : null;

	res.json({ tasks, nextCursor });
});

module.exports = router;
