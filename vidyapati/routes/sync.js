var express = require('express');
var router = express.Router();
const passport = require('../auth/local');
const authHelpers = require('../auth/_helpers');
const taskQueue = require('../queue');

router.post('/pull', passport.authenticate('jwt', {session: false}), authHelpers.adminRequired, async function(req, res, next) {
  try {
    const { id, timestamp } = await taskQueue.add({
      task: 'pull'
    });
    res.status(201).json({ id, timestamp });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post('/push', passport.authenticate('jwt', {session: false}), authHelpers.adminRequired, async function(req, res, next) {
  try {
    const { id, timestamp } = await taskQueue.add({
      task: 'push'
    });
    res.status(201).json({ id, timestamp });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
