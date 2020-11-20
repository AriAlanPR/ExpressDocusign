var express = require('express');
var docusign = require('./../model/docusign');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  
  console.log('parameters', req.query);
  res.render('docusign', { title: 'DocuSign', redirect_url: docusign.authorize_Token(req.query.code) });
});

router.get('/consent', function(req, res, next) {
  console.log('parameters', req.query);
  
  res.redirect(docusign.get_Consent());
  // res.render('docusign', { title: 'DocuSign', redirect_url: docusign.authorize_Token() });
});

/* POST page. */
router.post('/', function(req, res) {
  console.log('entering normal post');

  res.json(req.body);
});

//Authentication token receiver
router.get('/callback', async function(req, res) {
  console.log('entering callback get');
  console.log('data', req.query);

  let token = await docusign.authorize_Token(req.query.code);

  let file_array = await docusign.listEnvelopes(token.access_token);

  console.log(file_array);

  if(file_array){
    res.status(200).render('docusign/download', {
      files: file_array.envelopes
    });
  } else {
    res.status(500).json({ error: "could not get a valid access token"});
  }
});

router.post('/callback', function(req, res) {
  console.log('entering callback');
  console.log('data', req.body);

  res.json(req.body);
});

module.exports = router;