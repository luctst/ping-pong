const express = require('express');
const router = express.Router();

const response = require('../utils/response');

router.post('/', function (req, res) {
    return response(res, 200);
});

module.exports = router;