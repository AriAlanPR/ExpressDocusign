var express = require('express');
var sharepoint = require('./../model/sharepoint');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  console.log('parameters', req.query);

  res.render('sharepoint', { title: 'Sharepoint' });
});

/* POST page. */
router.post('/', function(req, res) {

  res.json(req.body);
});

module.exports = router;