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

//Authentication token receiver
router.get('/callback', async function(req, res) {
  console.log('entering callback get');
  console.log('data', req.query);
  
  let token = await docusign.authorize_Token(req.query.code);
  
  let file_array = await docusign.listEnvelopes(token.access_token);
  file_array = file_array.envelopes;
  // console.log(file_array);

  let documents_array = await docusign.listEnvelopeDocuments(token.access_token, file_array[0].documentsUri);
  
  if(file_array){
    res.status(200).render('docusign/download', {
      files: file_array,
      documents: documents_array,
      access_token: token.access_token
    });
  } else {
    res.status(500).json({ error: "could not get a valid access token"});
  }
});

router.get('/document', async function(req, res) {
  console.log('entering document get');
  console.log('data', req.query);

  if(req.access_token && req.subpath) {
    let document = docusign.getEnvelopeDocument(req.access_token, req.subpath);

    console.log('completed document request');
    console.log('document', document);

    res.status(200).render('docusign/document', {
      document: document
    });
  } else {
    res.status(500).json({ error: "failed to retrieve document uri"});
  } 
});

/* POST page. */
router.post('/', function(req, res) {
  console.log('entering normal post');

  res.json(req.body);
});

router.post('/envelopes', function(req, res) {
  console.log('entering callback');
  console.log('data', req.body);

  res.json(req.body);
});

module.exports = router;