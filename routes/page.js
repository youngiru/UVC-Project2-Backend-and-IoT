const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보' });
});
// 로그인이 안 되면 로그인 페이지로 다시 보내기.
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { title: 'login' });
});