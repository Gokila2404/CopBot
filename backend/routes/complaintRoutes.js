const express = require('express');
const { createComplaint, getComplaints } = require('../controllers/complaintController');
const router = express.Router();

router.post('/', createComplaint);
router.get('/', getComplaints);

module.exports = router;
