const express = require('express');
const controllers = require('../controllers');

const { ImageController } = controllers;

const router = express.Router();

// POST route to register a user
router.post('/upload', (req, res) => ImageController.uploadImage(req, res));

module.exports = router;
