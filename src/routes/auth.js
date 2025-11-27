const express = require('express');
const router = express.Router();
const { apiLogin, apiProfile, apiRegister } = require('../controller/authController');
const { authenticateJWT } = require('../middleware/jwtMiddleware');

router.post('/login', apiLogin);
router.post('/register', apiRegister);
router.get('/profile', authenticateJWT, apiProfile);

module.exports = router;
