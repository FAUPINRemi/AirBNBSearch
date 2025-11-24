const express = require('express');
const router = express.Router();
const {
  getIndex,
  postLogin,
  postLogout,
  getSearch
} = require('../controller/searchController');

router.get('/', getIndex);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/search', getSearch); 

module.exports = router;