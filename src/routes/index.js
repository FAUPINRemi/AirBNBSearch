const express = require('express');
const router = express.Router();
const {
  getIndex,
  postLogin,
  postLogout,
  getSearch,
  postRegister
} = require('../controller/searchController');

router.get('/', getIndex);
router.post('/login', postLogin);
router.post('/register', postRegister);
router.post('/logout', postLogout);
router.get('/search', getSearch); 

module.exports = router;