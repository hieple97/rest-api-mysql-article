const express = require('express');
const router = express.Router();
const { handleDeleteDataFacebook, handleGetDeletionStatus } = require('../controllers/facebook-controller');

router.get('/deletion_status', handleGetDeletionStatus);

router.post('/data_deletion', handleDeleteDataFacebook);

module.exports = router;
