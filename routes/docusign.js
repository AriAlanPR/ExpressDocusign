var express = require('express');
var docusign = require('./../model/docusign');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  console.log('parameters', req.query);
  
  res.redirect(docusign.authorize_Token());
  // res.render('docusign', { title: 'DocuSign' });
});

/* POST page. */
router.post('/', function(req, res) {

  res.json(req.body);
});

//Authentication token receiver
router.post('/callback', function(req, res) {

  res.json(req.body);
});

module.exports = router;